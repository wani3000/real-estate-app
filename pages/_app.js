import '../styles/globals.css'
import { FormProvider } from '../context/FormContext'

function MyApp({ Component, pageProps }) {
  console.log('_app.js 렌더링: FormProvider 적용')
  
  return (
    <FormProvider>
      <Component {...pageProps} />
    </FormProvider>
  )
}

export default MyApp
