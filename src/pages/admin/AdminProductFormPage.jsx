import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { phoneModelService } from '../../services/phoneModelService';
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
  Image as ImageIcon,
  Tag,
  DollarSign,
  Smartphone,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

export function AdminProductFormPage() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [phoneModels, setPhoneModels] = useState([]);

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
  const [selectedCompatibleModels, setSelectedCompatibleModels] = useState([]);

  useEffect(() => {
    async function initForm() {
      try {
        const [{ data: cats }, { data: brs }, { data: models }] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands(),
          phoneModelService.getPhoneModels()
        ]);
        setCategories(cats || []);
        setBrands(brs || []);
        setPhoneModels(models || []);

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
            setColorsInput(Array.isArray(prod.colors) ? prod.colors.map(c => typeof c === 'object' ? c.name : c).join(', ') : '');
            setStorageInput(Array.isArray(prod.storageOptions) ? prod.storageOptions.join(', ') : '');
            setSelectedCompatibleModels(Array.isArray(prod.compatibleModels) ? prod.compatibleModels : []);
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

  // Auto generate slug from Uzbek Name if creating
  const handleNameUzChange = (val) => {
    setNameUz(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const togglePhoneModel = (modelId) => {
    setSelectedCompatibleModels((prev) =>
      prev.includes(modelId) ? prev.filter((m) => m !== modelId) : [...prev, modelId]
    );
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
      compatibleModels: selectedCompatibleModels,
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
          <Package className="w-8 h-8 text-[#FF7A00]" />
          {isEdit ? t('admin.edit_product_title') : t('admin.new_product_title')}
        </h1>
      </div>

      {errorMsg && (
        <Alert variant="error" title={t('common.error')}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-5">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF7A00]" />
            {t('admin.basic_info_section')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.product_name_uz_label')} *
              </label>
              <Input
                value={nameUz}
                onChange={(e) => handleNameUzChange(e.target.value)}
                placeholder="iPhone 15 Pro Max 256GB"
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
                placeholder="iPhone 15 Pro Max 256GB"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.slug_label')}
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="iphone-15-pro-max-256gb"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.desc_uz_label')}
              </label>
              <textarea
                value={descUz}
                onChange={(e) => setDescUz(e.target.value)}
                rows={3}
                placeholder="Mahsulot haqida to'liq ma'lumot..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.desc_ru_label')}
              </label>
              <textarea
                value={descRu}
                onChange={(e) => setDescRu(e.target.value)}
                rows={3}
                placeholder="Product description (RU)..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
              />
            </div>
          </div>
        </Card>

        {/* Pricing, Category & Inventory */}
        <Card className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-5">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#FF7A00]" />
            {t('admin.pricing_inventory_section')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.category_col')}
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
                {t('admin.brand_col')}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.price_label')} (UZS) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15450000"
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
                placeholder="16500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.stock_count_label')}
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
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
        </Card>

        {/* Media & Options */}
        <Card className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-5">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#FF7A00]" />
            {t('admin.media_options_section')}
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.image_url_label')}
            </label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={imageUrl || 'https://placehold.co/80x80?text=Preview'}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.colors_comma_label')}
              </label>
              <Input
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                placeholder="Black, Silver, Gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.storage_comma_label')}
              </label>
              <Input
                value={storageInput}
                onChange={(e) => setStorageInput(e.target.value)}
                placeholder="128GB, 256GB, 512GB"
              />
            </div>
          </div>
        </Card>

        {/* Phone Compatibility Matrix */}
        <Card className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FF7A00]" />
              {t('admin.phone_compatibility_section')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('admin.phone_compatibility_desc')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2 max-h-60 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-2xl">
            {phoneModels.map((model) => {
              const checked = selectedCompatibleModels.includes(model.id);
              return (
                <button
                  type="button"
                  key={model.id}
                  onClick={() => togglePhoneModel(model.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    checked
                      ? 'bg-orange-50 dark:bg-orange-950/40 border-[#FF7A00] text-[#FF7A00]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{model.name}</span>
                  {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/admin/products">
            <Button variant="ghost" size="md">
              {t('common.cancel')}
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            disabled={saving}
            className="font-bold shadow-lg shadow-orange-500/20"
          >
            {saving ? t('common.loading') : isEdit ? t('admin.save_changes_btn') : t('admin.create_product_btn')}
          </Button>
        </div>
      </form>
    </div>
  );
}
