import React from "react";
import { createRoot } from "react-dom/client";

import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";

import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { RequestInterceptor, ResponseInterceptor } from "./interceptor";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./querys/queryClient";

const container = document.getElementById("root");
if (!container) throw new Error("Elemento #root no encontrado en el HTML");

createRoot(container).render(
	<React.StrictMode>
		<ConfigProvider locale={esES}>
			<QueryClientProvider client={queryClient}>	
				<RequestInterceptor />
				<ResponseInterceptor />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		</ConfigProvider>
	</React.StrictMode>
);
