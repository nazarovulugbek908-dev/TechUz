import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { FolderTree, PlusCircle, Edit2, Trash2, CheckCircle2, Layers } from 'lucide-react';

export function AdminCategoriesPage() {
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts()
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setNameUz('');
    setNameRu('');
    setSlug('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setNameUz(cat.name_uz || cat.nameUz || '');
    setNameRu(cat.name_ru || cat.nameRu || '');
    setSlug(cat.slug || cat.id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nameUz.trim() || !nameRu.trim()) return;

    setSaving(true);
    const catSlug = slug.trim() || nameUz.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id || editingCategory.slug, {
        name_uz: nameUz,
        name_ru: nameRu,
        slug: catSlug
      });
      setFeedbackMsg(t('admin.category_updated_success'));
    } else {
      await categoryService.createCategory({
        name_uz: nameUz,
        name_ru: nameRu,
        slug: catSlug
      });
      setFeedbackMsg(t('admin.category_created_success'));
    }

    setSaving(false);
    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    await categoryService.deleteCategory(categoryToDelete.id || categoryToDelete.slug);
    setCategoryToDelete(null);
    setFeedbackMsg(t('admin.category_deleted_success'));
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const getProductCount = (catSlug) => {
    return products.filter((p) => p.category?.toLowerCase() === catSlug?.toLowerCase()).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <FolderTree className="w-5 h-5" />
            </div>
            {t('admin.categories_title')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t('admin.categories_subtitle')} ({categories.length})
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={openCreateModal}
          className="font-bold shadow-sm shadow-brand-500/20"
        >
          {t('admin.add_category_btn')}
        </Button>
      </div>

      {feedbackMsg && (
        <Alert variant="success" title={t('common.success')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card className="p-0 border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{t('admin.category_name_col') || t('admin.category_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.slug_label')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.products_count_col')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                {categories.map((cat) => {
                  const count = getProductCount(cat.slug || cat.id);
                  return (
                    <tr key={cat.id || cat.slug} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {language === 'ru' ? (cat.name_ru || cat.nameRu) : (cat.name_uz || cat.nameUz)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                        {cat.slug || cat.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold text-[11px] border border-brand-200 dark:border-brand-900">
                          {count} {t('common.items_short')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Edit2}
                            onClick={() => openEditModal(cat)}
                            className="text-neutral-600 hover:text-brand-600 dark:hover:text-brand-400"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Trash2}
                            onClick={() => setCategoryToDelete(cat)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? t('admin.edit_category_title') : t('admin.new_category_title')}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {language === 'ru' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_ru_col')} *
                </label>
                <Input
                  value={nameRu}
                  onChange={(e) => {
                    setNameRu(e.target.value);
                    if (!editingCategory && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder={t('admin.sample_category_covers_ru')}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_uz_col')} *
                </label>
                <Input
                  value={nameUz}
                  onChange={(e) => setNameUz(e.target.value)}
                  placeholder="G'iloflar va Chexollar"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_uz_col')} *
                </label>
                <Input
                  value={nameUz}
                  onChange={(e) => {
                    setNameUz(e.target.value);
                    if (!editingCategory && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="G'iloflar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_ru_col')} *
                </label>
                <Input
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  placeholder={t('admin.sample_category_cases_ru')}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.slug_label')}
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="cases"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_category_msg')}{' '}
            <strong>
              {categoryToDelete && (language === 'ru' ? categoryToDelete.name_ru : categoryToDelete.name_uz)}
            </strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setCategoryToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
