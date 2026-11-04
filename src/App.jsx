import Header from './templates/Header';
import Home from './pages/Home';
import About from './pages/About';

const pages = {
    '/': Home,
    '/sobre-nosotros': About,
};

function App() {
    const Page = pages[window.location.pathname];

    return (
        <>
            <Header />
            {Page ? <Page /> : <h1>404 - Página no encontrada</h1>}
        </>
    );
}

export default App;