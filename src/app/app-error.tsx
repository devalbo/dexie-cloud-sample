import { Link } from 'react-router-dom';

interface AppErrorProps {
  errorMessage?: string;
}

export const AppError = (props: AppErrorProps) => {

  const errorMessage = props.errorMessage;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
        {errorMessage && (
          <p className="text-lg text-red-600 mb-4">{errorMessage}</p>
        )}
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 
