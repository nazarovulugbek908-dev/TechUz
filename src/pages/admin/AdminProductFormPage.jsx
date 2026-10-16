import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  Package,
  ArrowLeft,
  Save,
  UploadCloud,
  Trash2
} from 'lucide-react';

export function AdminProductFormPage() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Form State
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [slug, setSlug] = useState('');
  const [descUz, setDescUz] = useState('');
  const [descRu, setDescRu] = useState('');
  const [category, setCategory] = useState('smartphones');
  const [brand, setBrand] = useState('Apple');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stock, setStock] = useState('15');
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('none');
  const [imageUrl, setImageUrl] = useState('');
  const [colorsInput, setColorsInput] = useState('Black, Silver, Blue');
  const [storageInput, setStorageInput] = useState('128GB, 256GB');

  useEffect(() => {
    async function initForm() {
      try {
        const [{ data: cats }, { data: brs }] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        setCategories(cats || []);
        setBrands(brs || []);

        if (isEdit) {
          const { data: prod } = await productService.getProductById(id);
          if (prod) {
            setNameUz(prod.name_uz || prod.nameUz || '');
            setNameRu(prod.name_ru || prod.nameRu || '');
            setSlug(prod.slug || '');
            setDescUz(prod.description_uz || prod.descUz || '');
            setDescRu(prod.description_ru || prod.descRu || '');
            setCategory(prod.category || 'smartphones');
            setBrand(prod.brand || 'Apple');
            setPrice(String(prod.price || ''));
            setOldPrice(prod.oldPrice ? String(prod.oldPrice) : '');
            setStock(String(prod.stock || '0'));
            setSku(prod.sku || '');
            setBadge(prod.badge || 'none');
            setImageUrl(prod.images?.[0] || '');
            setColorsInput(
              Array.isArray(prod.colors)
                ? prod.colors.map((c) => (typeof c === 'object' ? c.name : c)).join(', ')
                : ''
            );
            setStorageInput(
              Array.isArray(prod.storageOptions) ? prod.storageOptions.join(', ') : ''
            );
          }
        } else {
          setSku(`SKU-${Math.floor(10000 + Math.random() * 90000)}`);
          setImageUrl('https://placehold.co/600x600/f8fafc/0f172a?text=TechUz+Product');
        }
      } catch (err) {
        console.error('Failed to init product form:', err);
      } finally {
        setLoading(false);
      }
    }

    initForm();
  }, [id, isEdit]);

  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle image file upload to Supabase Storage
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('common.error_occurred'));
        return;
      }
      setUploadingImage(true);
      try {
        const publicUrl = await productService.uploadProductImage(file);
        if (publicUrl) {
          setImageUrl(publicUrl);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Auto generate slug from Uzbek Name if creating
  const handleNameUzChange = (val) => {
    setNameUz(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nameUz.trim() || !nameRu.trim() || !price || Number(price) <= 0) {
      setErrorMsg(t('admin.error_fill_product_required'));
      return;
    }

    setSaving(true);

    const colorsArray = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((name) => ({ name, hex: '#4B5563' }));

    const storageArray = storageInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      nameUz,
      nameRu,
      name_uz: nameUz,
      name_ru: nameRu,
      slug: slug || `prod-${Date.now()}`,
      descUz,
      descRu,
      description_uz: descUz,
      description_ru: descRu,
      category,
      brand,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      stock: Number(stock) || 0,
      sku: sku || `SKU-${Date.now().toString().slice(-5)}`,
      badge: badge === 'none' ? null : badge,
      images: [imageUrl || 'https://placehold.co/600x600/f8fafc/0f172a?text=TechUz+Product'],
      colors: colorsArray,
      storageOptions: storageArray,
      warrantyMonths: 12
    };

    let result;
    if (isEdit) {
      result = await productService.updateProduct(id, productPayload);
    } else {
      result = await productService.createProduct(productPayload);
    }

    setSaving(false);

    if (result.error) {
      setErrorMsg(t(result.error.message) || result.error.message);
    } else {
      navigate('/admin/products');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white">
            {t('admin.nav_dashboard')}
          </Link>
          <span>/</span>
          <Link to="/admin/products" className="hover:text-slate-900 dark:hover:text-white">
            {t('admin.nav_products')}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">
            {isEdit ? t('admin.edit_product_title') : t('admin.new_product_title')}
          </span>
        </div>

        <Link to="/admin/products">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            {t('common.cancel')}
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Package className="w-5 h-5" />
          </div>
          {isEdit ? t('admin.edit_product_title') : t('admin.new_product_title')}
        </h1>
      </div>

      {errorMsg && (
        <Alert variant="error" title={t('common.error')}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Perfectly Symmetrical & Aligned Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: 8 Columns - Consistent 2-Column Inputs Grid */}
          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-5 shadow-xs">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t('admin.basic_info_section')}
              </h2>

              {/* Row 1: Product Names (UZ & RU) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.product_name_uz_label')} *
                  </label>
                  <Input
                    value={nameUz}
                    onChange={(e) => handleNameUzChange(e.target.value)}
                    placeholder="Apple AirPods Pro 2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.product_name_ru_label')} *
                  </label>
                  <Input
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="Apple AirPods Pro 2"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.category_col')} *
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={categories.map((c) => ({
                      value: c.slug || c.id,
                      label: language === 'ru' ? c.name_ru : c.name_uz
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.brand_col')} *
                  </label>
                  <Select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    options={brands.map((b) => ({
                      value: b.name,
                      label: b.name
                    }))}
                  />
                </div>
              </div>

              {/* Row 3: Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.price_label')} (UZS) *
                  </label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3150000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.old_price_label')} (UZS)
                  </label>
                  <Input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="3450000"
                  />
                </div>
              </div>

              {/* Row 4: Stock & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.stock_count_label')} *
                  </label>
                  <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="16"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.badge_label')}
                  </label>
                  <Select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    options={[
                      { value: 'none', label: t('admin.no_badge') },
                      { value: 'sale', label: 'Sale (Chegirma)' },
                      { value: 'new', label: 'New (Yangi)' },
                      { value: 'top', label: 'Top (Ommabop)' }
                    ]}
                  />
                </div>
              </div>

              {/* Row 5: Colors & Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.colors_comma_label')}
                  </label>
                  <Input
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="White, Black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.storage_comma_label')}
                  </label>
                  <Input
                    value={storageInput}
                    onChange={(e) => setStorageInput(e.target.value)}
                    placeholder="128GB, 256GB"
                  />
                </div>
              </div>

              {/* Row 6: SKU & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    SKU ({t('admin.stock_keeping_unit')})
                  </label>
                  <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-84920"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Slug ({t('admin.slug_label')})
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="apple-airpods-pro-2"
                  />
                </div>
              </div>

              {/* Row 7: Descriptions (UZ & RU) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('admin.desc_uz_label')}
                  </label>
                  <textarea
                    value={descUz}
                    onChange={(e) => setDescUz(e.target.value)}
                    rows={4}
                    placeholder="Apple AirPods Pro 2..."
                    className="w-full text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {t('admin.desc_ru_label')}
                  </label>
                  <textarea
                    value={descRu}
                    onChange={(e) => setDescRu(e.target.value)}
                    rows={4}
                    placeholder="Apple AirPods Pro 2..."
                    className="w-full text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT: 4 Columns - Dedicated Photo & Actions Card */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
            {/* Photo Card */}
            <Card className="p-6 border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {t('admin.media_options_section')}
              </h2>

              <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col items-center justify-center transition-all group overflow-hidden">
                {uploadingImage ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <LoadingSpinner size="md" />
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">Rasm yuklanmoqda...</p>
                  </div>
                ) : imageUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full aspect-square max-w-[240px] rounded-xl bg-white dark:bg-neutral-800 p-3 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shadow-xs">
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4 w-full">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-200 dark:border-neutral-700"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>{t('admin.edit_btn')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="py-2 px-3 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title={t('admin.delete_btn')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-12 flex flex-col items-center justify-center cursor-pointer text-center"
                  >
                    <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t('admin.image_url_label')}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {t('admin.image_url_label')}
                    </p>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </Card>

            {/* Actions Card */}
            <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 space-y-3 shadow-xs">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Save}
                disabled={saving}
                className="w-full font-bold shadow-sm shadow-brand-500/20 py-3"
              >
                {saving
                  ? t('common.loading')
                  : isEdit
                  ? t('admin.save_changes_btn')
                  : t('admin.create_product_btn')}
              </Button>

              <Link to="/admin/products" className="block">
                <Button variant="ghost" size="md" className="w-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  {t('common.cancel')}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
