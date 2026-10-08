import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { usePhoneModel } from '../context/PhoneModelContext';
import { productService } from '../services/productService';
import { formatUzbekCurrency } from '../utils/currency';
import { ProductCard } from '../components/product/ProductCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { QuantityCounter } from '../components/common/QuantityCounter';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Smartphone,
  Check,
  Zap,
  ArrowLeft,
  Share2,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language, isUz } = useLanguage();
  const { addToCart } = useCart();
  const { checkCompatibility, hasSelectedModel, selectedModel } = usePhoneModel();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Variant & Image state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specifications' | 'delivery'
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const { data } = await productService.getProductBySlug(slug);
        if (data) {
          setProduct(data);
          setSelectedImageIndex(0);
          if (data.colors && data.colors.length > 0) {
            const firstColor = typeof data.colors[0] === 'object' ? data.colors[0].name : data.colors[0];
            setSelectedColor(firstColor);
          }
          if (data.storageOptions && data.storageOptions.length > 0) {
            setSelectedStorage(data.storageOptions[0]);
          }

          // Fetch related
          const { data: related } = await productService.getProducts({
            category: data.category,
            limit: 4
          });
          setRelatedProducts((related || []).filter((p) => p.slug !== data.slug));
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('catalog.no_products')}
        </h1>
        <Link to="/shop">
          <Button variant="primary" size="md">
            {t('nav.shop')}
          </Button>
        </Link>
      </div>
    );
  }

  const productName = isUz ? (product.nameUz || product.name_uz) : (product.nameRu || product.name_ru);
  const productDesc = isUz ? (product.descUz || product.description_uz) : (product.descRu || product.description_ru);
  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'];
  const currentImage = images[selectedImageIndex] || images[0];

  const isOutOfStock = product.stock <= 0;
  const { isChecked, isCompatible } = checkCompatibility(product);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-slate-900 dark:hover:text-white transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">
          {productName}
        </span>
      </div>

      {/* Main Product Layout (Gallery Left, Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              src={currentImage}
              alt={productName}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
              }}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={clsx(
                    'w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border p-1.5 shrink-0 transition-all',
                    selectedImageIndex === idx
                      ? 'border-[#FF7A00] ring-2 ring-orange-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="space-y-6">
          {/* Brand & Badges */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-2">
              {product.badge === 'sale' && <Badge variant="error">SALE</Badge>}
              {product.badge === 'new' && <Badge variant="primary">NEW</Badge>}
              {product.badge === 'top' && <Badge variant="warning">TOP</Badge>}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white leading-tight">
            {productName}
          </h1>

          {/* Rating & SKU */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={product.rating || 5.0} />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {product.rating || 5.0}
              </span>
              <span className="text-slate-400">({product.reviewsCount || 1})</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-mono">
              SKU: {product.sku || product.id}
            </span>
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-heading text-[#FF7A00]">
                {formatUzbekCurrency(product.price, language)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatUzbekCurrency(product.oldPrice, language)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold">
              {product.stock > 0 ? t('product.in_stock') : t('product.out_of_stock')} ({product.stock} {t('common.piece_short')})
            </p>
          </div>

          {/* Device Compatibility Banner */}
          {isChecked && (
            <div
              className={clsx(
                'p-4 rounded-2xl border flex items-center gap-3 text-xs',
                isCompatible
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              )}
            >
              <Smartphone className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">
                  {isCompatible
                    ? `${selectedModel?.name} ${t('phone_model.compatible_badge')}`
                    : `${selectedModel?.name} — ${t('phone_model.not_compatible')}`}
                </p>
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {t('product.color')}: <span className="text-[#FF7A00]">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((c, idx) => {
                  const cName = typeof c === 'object' ? c.name : c;
                  const isSelected = selectedColor === cName;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedColor(cName)}
                      className={clsx(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all',
                        isSelected
                          ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      )}
                    >
                      {cName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Storage Selector */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {t('product.storage')}: <span className="text-[#FF7A00]">{selectedStorage}</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.storageOptions.map((s, idx) => {
                  const isSelected = selectedStorage === s;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedStorage(s)}
                      className={clsx(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all',
                        isSelected
                          ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <QuantityCounter
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={product.stock}
              />
              <span className="text-xs text-slate-400">
                {product.warrantyMonths || 12} {t('product.warranty_months')}
              </span>
            </div>

            {addedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('product.added_to_cart')}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={ShoppingBag}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="font-bold shadow-lg shadow-orange-500/20"
              >
                {t('product.add_to_cart')}
              </Button>

              <Button
                variant="outline"
                size="lg"
                icon={Zap}
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="font-bold"
              >
                {t('cart.checkout_button')}
              </Button>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <span>{t('benefits.delivery_title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('benefits.warranty_title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{t('benefits.returns_title')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Delivery */}
      <Card className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={clsx(
              'font-heading font-bold text-sm pb-2 border-b-2 -mb-3.5 transition-colors',
              activeTab === 'description'
                ? 'border-[#FF7A00] text-[#FF7A00]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            )}
          >
            {t('product.description')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specifications')}
            className={clsx(
              'font-heading font-bold text-sm pb-2 border-b-2 -mb-3.5 transition-colors',
              activeTab === 'specifications'
                ? 'border-[#FF7A00] text-[#FF7A00]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            )}
          >
            {t('product.specifications')}
          </button>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeTab === 'description' ? (
            <div className="space-y-4 max-w-3xl">
              <p>{productDesc || 'Ushbu mahsulot haqida to\'liq ma\'lumot tez orada taqdim etiladi.'}</p>
              {product.compatibleModels && product.compatibleModels.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t('phone_model.compatible_with')}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatibleModels.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-xl space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t('admin.brand_col')}</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t('admin.category_col')}</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">SKU</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{product.sku || product.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">{t('benefits.warranty_title')}</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.warrantyMonths || 12} {t('product.warranty_months')}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
            {t('home.deals_title')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id || rel.slug} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
