import React from "react"
import ReactDOM from "react-dom/client"
import { ConfigProvider } from "antd"
import { BrowserRouter } from "react-router-dom"
import esES from "antd/lib/locale/es_ES"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
	<ConfigProvider
		locale={esES}
	>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ConfigProvider>
</React.StrictMode>,
)
