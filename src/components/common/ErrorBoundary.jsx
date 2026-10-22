import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TechUz caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#15171D] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#1D2028] p-6 sm:p-8 rounded-2xl border border-[#E6E8EE] dark:border-[#2A2E3B] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center font-bold text-xl mx-auto">
              T
            </div>
            <h2 className="text-lg font-bold text-[#17191F] dark:text-white">
              Sahifani yuklashda xatolik yuz berdi
            </h2>
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF] leading-relaxed">
              Kutilmagan xatolik yuz berdi. Iltimos, sahifani qayta yuklang yoki bosh sahifaga o'ting.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-[#00A859] hover:bg-[#00924C] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Sahifani yangilash
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-xl border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-white text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#15171D] transition-colors"
              >
                Bosh sahifaga qaytish
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
