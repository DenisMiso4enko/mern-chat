import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage'
import { HomePage } from './pages/HomePage'

function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/'>
					<Route index element={<HomePage />} />
					<Route path='chat' element={<ChatPage />} />
				</Route>
			</Routes>
		</div>
	)
}

export default App
