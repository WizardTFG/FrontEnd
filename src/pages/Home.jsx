import './Home.css';

function Home() {
    return (
        <div className="app">

            <main>
                <section className="hero" id="producto">
                    <h1>
                        Crea aplicaciones web
                        <br />
                        de una forma nueva
                    </h1>

                    <p className="hero-description">
                        Diseña, configura y despliega aplicaciones web
                        personalizadas mediante un asistente inteligente.
                    </p>

                    <a href="/login" className="hero-button">
                        Empezar ahora
                    </a>

                    <p className="hero-note">
                        Crea y gestiona tus propias aplicaciones web.
                    </p>

                    {/* Vista ilustrativa de la plataforma */}
                    <div className="preview">

                        <div className="preview-sidebar">
                            <h3>Panel de control</h3>
                            <p>Mis aplicaciones</p>
                            <p>Crear aplicación</p>
                            <p>Formularios</p>
                            <p>Indicadores</p>
                        </div>

                        <div className="preview-content">

                            <div className="preview-topbar">
                                <strong>Mi aplicación web</strong>
                                <span>Administrador</span>
                            </div>

                            <div className="preview-body">

                                <div className="preview-text">
                                    <h2>
                                        Gestiona tus
                                        aplicaciones
                                    </h2>

                                    <p>
                                        Configura formularios,
                                        integra modelos predictivos
                                        y visualiza resultados.
                                    </p>

                                    <button>
                                        Crear aplicación
                                    </button>
                                </div>

                                <div className="preview-cards">
                                    <div className="preview-card">
                                        <span>01</span>
                                        <h3>Formularios</h3>
                                        <p>Configuración dinámica</p>
                                    </div>

                                    <div className="preview-card">
                                        <span>02</span>
                                        <h3>Indicadores</h3>
                                        <p>Gestión y visualización</p>
                                    </div>

                                    <div className="preview-card">
                                        <span>03</span>
                                        <h3>Predicciones</h3>
                                        <p>Integración de modelos</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </section>
            </main>
        </div>
    );
}

export default Home;