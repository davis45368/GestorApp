"use client"

import { Layout, Dropdown, Button, Avatar, Space, Flex, Typography, Select, theme, Image } from "antd"
import { UserOutlined, DownOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../paths"
import { useEffect } from "react"
import useUserModeStore, { UserFontUse } from "@/context/useUserModeStore"
import { Option } from "@/types"
import { MenuProps } from "antd/lib"
import logo from "../../../assets/GestorAppLogo.png"
import useUserDataStore from "@/context/userDataContext"
import { resetAllStores } from "@/utils/storeCreate"

const { Header } = Layout

const AppHeader = () => {
  const { user } = useUserDataStore()
  const navigate = useNavigate()

  const { darkMode, userMode, setUserMode, setMode } = useUserModeStore(state => state);

  const { token: { colorBgContainer, colorBorder } } = theme.useToken();

	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		const isDark = event.matches;
		if (userMode == UserFontUse.AUTO)setMode(isDark);
	});

	const options: Option[] = [
		{ label: 'Automatico', value: UserFontUse.AUTO },
		{ label: 'Claro', value: UserFontUse.LIGHT },
		{ label: 'Oscuro', value: UserFontUse.DARK },
	];

	const onSelectFontMode = (value: UserFontUse) => {
		setUserMode(value);
		if (value == UserFontUse.AUTO) {
			setMode(prefersDarkMode);
			return;
		}

		if (value == UserFontUse.LIGHT) {
			setMode(false);
			return;
		}

		setMode(true);
	};

	useEffect(() => {
		if (userMode == UserFontUse.AUTO && prefersDarkMode) {
			setMode(prefersDarkMode);
		}
	}, []);

  const handleLogout = () => {
	void resetAllStores()
    navigate(PATHS.LOGIN)
  }

  const items: MenuProps['items'] = [
    // {
	// 		key: 'changePassword',
	// 		icon: <KeyOutlined style={{ fontSize: '16px' }} />,
	// 		label: 'Cambiar Contraseña',
	// 		onClick: () => navigate(PATHS.CHANGE_PASSWORD),
	// 	},
		{
			key: 'mondeFont',
			label:  (
				<Flex justify='space-between' align='center' gap={8} style={{ width: '100%' }}>
					<Flex justify='start' gap={6}>
						{darkMode ? <MoonOutlined style={{ fontSize: '16px' }} /> : <SunOutlined style={{ fontSize: '16px' }} />}
						<Typography.Text>Tema</Typography.Text>
					</Flex>

					<Select
						onSelect={(value) => onSelectFontMode(value)}
						style={{ width: 120 }}
						defaultValue={userMode}
						popupMatchSelectWidth={false}
						options={options}
					/>
				</Flex>
			),
			popupStyle:{ display: 'none' },
			children:[],
			expandIcon: <></>,
		},
		{
			key: 'logout',
			icon: <LogoutOutlined style={{ fontSize: '16px' }} />,
			label: 'Cerrar Sesión',
			onClick: () => handleLogout(),
		},
  ]

  return (
    <Header 
      className="app-header"
      style={{
        background: colorBgContainer,
        borderBottom: '2px solid' + colorBorder,
      }}
    >
      
	  <Image preview={false} src={logo} width={'160px'} />

      {user && (
        <div className="user-menu">
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button ghost type="primary" style={{ height: '40px' }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                	{user.firstName}{' '}{user.lastName}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      )}
    </Header>
  )
}

export default AppHeader
