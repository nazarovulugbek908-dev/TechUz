import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { formatUzbekCurrency } from '../../utils/currency';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  LayoutGrid,
  List
} from 'lucide-react';

export function AdminProductsPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(() => {
    return searchParams.get('search') || searchParams.get('q') || '';
  });

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setSearch(q);
  }, [searchParams]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all | in_stock | low_stock | out_of_stock
  const [saleOnly, setSaleOnly] = useState(false);

  // Delete Modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: prodList }, { data: catList }, { data: brandList }] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands()
      ]);
      setProducts(prodList || []);
      setCategories(catList || []);
      setBrands(brandList || []);
    } catch (err) {
      console.error('Failed to load products list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    await productService.deleteProduct(productToDelete.id);
    setDeleting(false);
    setProductToDelete(null);
    setActionSuccessMsg(t('admin.product_deleted_success'));
    setTimeout(() => setActionSuccessMsg(''), 3000);
    await loadData();
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNameUz = (p.name_uz || p.nameUz || '').toLowerCase().includes(q);
      const matchNameRu = (p.name_ru || p.nameRu || '').toLowerCase().includes(q);
      const matchBrand = (p.brand || '').toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      if (!matchNameUz && !matchNameRu && !matchBrand && !matchSku) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Brand
    if (selectedBrand !== 'all' && p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }

    // Stock
    if (stockFilter === 'in_stock' && Number(p.stock) <= 0) return false;
    if (stockFilter === 'low_stock' && (Number(p.stock) <= 0 || Number(p.stock) >= 5)) return false;
    if (stockFilter === 'out_of_stock' && Number(p.stock) > 0) return false;

    // Sale
    if (saleOnly && !(p.oldPrice && p.oldPrice > p.price)) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#00A859]" />
            {t('admin.products_title')}
          </h1>
          <p className="text-xs text-[#737985] dark:text-slate-400 mt-1">
            {t('admin.products_subtitle')} ({filteredProducts.length})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 rounded-lg p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#00A859] text-white shadow-xs font-bold'
                  : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
              }`}
              title="Table"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#00A859] text-white shadow-xs font-bold'
                  : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
              }`}
              title="Grid"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link to="/admin/products/new">
            <Button variant="primary" size="md" icon={PlusCircle} className="font-bold cursor-pointer">
              {t('admin.add_product_btn')}
            </Button>
          </Link>
        </div>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" title={t('common.success')}>
          {actionSuccessMsg}
        </Alert>
      )}

      {/* Filter Card */}
      <Card className="p-4 sm:p-5 border border-[#E6E8EE] dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder={t('admin.search_product_placeholder')}
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              if (val.trim()) {
                setSearchParams((prev) => {
                  prev.set('search', val);
                  return prev;
                });
              } else {
                setSearchParams((prev) => {
                  prev.delete('search');
                  prev.delete('q');
                  return prev;
                });
              }
            }}
            icon={Search}
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'all', label: t('admin.all_categories_filter') },
              ...categories.map((c) => ({
                value: c.slug || c.id,
                label: language === 'ru' ? c.name_ru : c.name_uz
              }))
            ]}
          />

          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            options={[
              { value: 'all', label: t('admin.all_brands_filter') },
              ...brands.map((b) => ({
                value: b.name || b.id,
                label: b.name
              }))
            ]}
          />

          <Select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            options={[
              { value: 'all', label: t('admin.all_stock_filter') },
              { value: 'in_stock', label: t('admin.filter_in_stock') },
              { value: 'low_stock', label: t('admin.filter_low_stock') },
              { value: 'out_of_stock', label: t('admin.filter_out_of_stock') }
            ]}
          />
        </div>
      </Card>

      {/* Products Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#737985]">
              {t('admin.no_products_found')}
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLowStock = Number(p.stock) > 0 && Number(p.stock) < 5;
              const isOutOfStock = Number(p.stock) <= 0;

              return (
                <Card
                  key={p.id}
                  className="p-4 hover:border-[#00A859] transition-all flex flex-col justify-between group bg-white dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-lg bg-[#F7F8FA] dark:bg-slate-800 p-3 mb-3 flex items-center justify-center overflow-hidden border border-[#E6E8EE] dark:border-slate-700/60">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/200x200?text=Product'}
                        alt=""
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {p.badge === 'sale' && <Badge variant="error" size="sm">SALE</Badge>}
                        {p.badge === 'new' && <Badge variant="primary" size="sm">NEW</Badge>}
                        {p.badge === 'top' && <Badge variant="warning" size="sm">TOP</Badge>}
                      </div>
                      <div className="absolute top-2 right-2">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[#D64545] border border-red-500/20 text-[10px] font-bold">
                            {t('admin.stock_out')}
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            {p.stock} ta
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#16845B] border border-emerald-500/20 text-[10px] font-bold">
                            {p.stock} ta
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-[#737985] font-semibold uppercase tracking-wider mb-1">
                      {p.brand} • <span className="capitalize">{p.category}</span>
                    </div>
                    <h3 className="font-semibold text-[#17191F] dark:text-white line-clamp-2 text-sm group-hover:text-[#00A859] transition-colors mb-2">
                      {language === 'ru' ? (p.name_ru || p.nameRu) : (p.name_uz || p.nameUz)}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E6E8EE] dark:border-slate-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="font-bold text-base text-[#00A859]">
                        {formatUzbekCurrency(p.price, language)}
                      </div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="text-[11px] text-[#737985] line-through">
                          {formatUzbekCurrency(p.oldPrice, language)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`/product/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[#737985] hover:text-[#00A859] hover:bg-[#E6F7EF] dark:hover:bg-slate-800 transition-colors"
                        title={t('admin.back_to_store')}
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg text-[#737985] hover:text-[#00A859] hover:bg-[#E6F7EF] dark:hover:bg-slate-800 transition-colors"
                          title={t('admin.edit_btn')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-2 rounded-lg text-[#D64545] hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <Card className="p-0 border border-[#E6E8EE] dark:border-slate-800 overflow-hidden shadow-xs bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FA] dark:bg-slate-800/80 text-[#737985] border-b border-[#E6E8EE] dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{t('admin.product_col')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('admin.category_col')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('admin.brand_col')}</th>
                  <th className="py-3.5 px-4 font-semibold whitespace-nowrap">{t('admin.price_col')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('admin.stock_col')}</th>
                  <th className="py-3.5 px-4 font-semibold">{t('admin.badges_col')}</th>
                  <th className="py-3.5 px-4 font-semibold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EE] dark:divide-slate-800 font-medium">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#737985]">
                      {t('admin.no_products_found')}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = Number(p.stock) > 0 && Number(p.stock) < 5;
                    const isOutOfStock = Number(p.stock) <= 0;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => navigate(`/admin/products/${p.id}`)}
                        className="hover:bg-[#F7F8FA] dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                      >
                        {/* Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-[#E6E8EE] dark:border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center transition-colors shadow-xs">
                              <img
                                src={p.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-sm">
                              <span className="font-semibold text-[#17191F] dark:text-white group-hover:text-[#00A859] truncate block transition-colors text-sm">
                                {language === 'ru' ? (p.name_ru || p.nameRu) : (p.name_uz || p.nameUz)}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                                <span className="text-[#737985] font-mono text-[10px]">
                                  SKU: {p.sku || p.id}
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <a
                                  href={`/product/${p.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 font-semibold text-[#00A859] hover:underline"
                                  title={t('admin.back_to_store')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{t('admin.back_to_store')}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-[#737985] dark:text-slate-300 whitespace-nowrap">
                          <span className="capitalize">{p.category}</span>
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4 font-semibold text-[#17191F] dark:text-slate-200 whitespace-nowrap">
                          {p.brand}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-[#00A859]">
                            {formatUzbekCurrency(p.price, language)}
                          </div>
                          {p.oldPrice && p.oldPrice > p.price && (
                            <span className="text-[10px] text-[#737985] line-through block">
                              {formatUzbekCurrency(p.oldPrice, language)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-[#D64545] border border-red-200 dark:border-red-800 text-[10px] font-bold">
                              {t('admin.stock_out')}
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                              {p.stock} ({t('admin.stock_low')})
                            </span>
                          ) : (
                            <span className="text-[#17191F] dark:text-slate-300 font-semibold">
                              {p.stock} {t('common.piece_short')}
                            </span>
                          )}
                        </td>

                        {/* Badges */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {p.badge === 'sale' && <Badge variant="error" size="sm">SALE</Badge>}
                            {p.badge === 'new' && <Badge variant="primary" size="sm">NEW</Badge>}
                            {p.badge === 'top' && <Badge variant="warning" size="sm">TOP</Badge>}
                            {!p.badge && <span className="text-slate-300 text-[11px]">—</span>}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/product/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition-colors cursor-pointer"
                              title={t('admin.back_to_store')}
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <Link
                              to={`/admin/products/${p.id}`}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition-colors cursor-pointer"
                              title={t('admin.edit_btn')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_product_msg')}{' '}
            <strong>
              {productToDelete && (language === 'ru' ? productToDelete.name_ru : productToDelete.name_uz)}
            </strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setProductToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? t('common.loading') : t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
