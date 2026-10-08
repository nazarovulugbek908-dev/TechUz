import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
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
  Eye
} from 'lucide-react';

export function AdminProductsPage() {
  const { t, language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all | in_stock | low_stock | out_of_stock
  const [saleOnly, setSaleOnly] = useState(false);

  // Delete Modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

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
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#FF7A00]" />
            {t('admin.products_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.products_subtitle')} ({filteredProducts.length})
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" icon={PlusCircle} className="font-bold shadow-lg shadow-orange-500/20">
            {t('admin.add_product_btn')}
          </Button>
        </Link>
      </div>

      {actionSuccessMsg && (
        <Alert variant="success" title={t('common.success')}>
          {actionSuccessMsg}
        </Alert>
      )}

      {/* Filter Card */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder={t('admin.search_product_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Product Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card className="p-0 border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{t('admin.product_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.category_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.brand_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.price_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.stock_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.badges_col')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      {t('admin.no_products_found')}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = Number(p.stock) > 0 && Number(p.stock) < 5;
                    const isOutOfStock = Number(p.stock) <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Image & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                              <img
                                src={p.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {language === 'ru' ? (p.name_ru || p.nameRu) : (p.name_uz || p.nameUz)}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                SKU: {p.sku || p.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          <span className="capitalize">{p.category}</span>
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {p.brand}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div className="font-black text-[#FF7A00]">
                            {formatUzbekCurrency(p.price, language)}
                          </div>
                          {p.oldPrice && p.oldPrice > p.price && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              {formatUzbekCurrency(p.oldPrice, language)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-[10px] font-bold">
                              {t('admin.stock_out')}
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                              {p.stock} ({t('admin.stock_low')})
                            </span>
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300 font-bold">
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
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link to={`/admin/products/${p.id}`}>
                              <Button
                                variant="ghost"
                                size="xs"
                                icon={Edit2}
                                className="text-slate-600 hover:text-[#FF7A00]"
                                aria-label="Edit"
                              />
                            </Link>
                            <Button
                              variant="ghost"
                              size="xs"
                              icon={Trash2}
                              onClick={() => setProductToDelete(p)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                              aria-label="Delete"
                            />
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
