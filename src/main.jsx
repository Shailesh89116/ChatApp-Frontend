import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './routes/Routes'
import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
<RouterProvider router={router} />
    </Provider>
    
)
