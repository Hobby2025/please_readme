import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-brand-light max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-primary mb-4 font-ridi">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-primary hover:bg-brand-orange transition-all shadow-md active:scale-95"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
