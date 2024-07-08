import { APP_NAME } from '@/lib/constants'

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
       { new Date().getFullYear()} {APP_NAME}. All Rights reserved.
      </div>
    </footer>
  )
}

export default Footer