import NextLogo from './NextLogo'
import SupabaseLogo from './SupabaseLogo'

export default function Header() {
  return (
    <div className="flex flex-col gap-1 items-center">
      <h1 className="font-bold text-4xl mb-4 mt-3">Rental Review</h1>
      <h2 className="font-bold text-2xl mb-4">Welcome to our web app.</h2>
    </div>
  )
}
