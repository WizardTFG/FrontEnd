import './Home.css';

function Home() {
    return (
        <div className="app">

            <main>
                <section className="hero" id="producto">
                    <h1>
                        Crea aplicaciones web
                        <br />
                        de una nueva forma
                    </h1>

                    <p className="hero-description">
                        Diseña, configura y despliega aplicaciones web
                        personalizadas mediante un asistente inteligente.
                    </p>

                    <a href="/iniciar-sesion" className="hero-button">
                        Empezar ahora
                    </a>

                    <p className="hero-note">
                        Crea y gestiona tus propias aplicaciones web.
                    </p>
                </section>

                <section className="home">
                    <div className="home-header">
                        <h2>Cómo crear una aplicación web</h2>

                        <p>
                            Con WEBGEN puedes crear aplicaciones web personalizadas
                            de forma sencilla mediante nuestro asistente inteligente.
                        </p>
                    </div>

                    <div className="home-steps">

                        <div className="home-step">
                            <span className="step-number">(01)</span>
                            <div>
                                <h3>Crea tu cuenta gratuitamente.</h3>
                                <p>
                                    Regístrate en WEBGEN para comenzar a crear y gestionar
                                    tus propias aplicaciones web.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <span className="step-number">(02)</span>
                            <div>
                                <h3>Pide el rol adecuado.</h3>
                                <p>
                                    Como clínico puedes hacer uso de tus webs asignadas, pero
                                    para crear, pide el rol de administrador des del perfil.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <span className="step-number">(03)</span>
                            <div>
                                <h3>Personaliza tu aplicación.</h3>
                                <p>
                                    Ajusta el diseño, añade formularios y adapta
                                    la aplicación web a tus necesidades.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <span className="step-number">(04)</span>
                            <div>
                                <h3>Crea tu aplicación.</h3>
                                <p>
                                    Nuestro asistente inteligente transformará tus
                                    indicaciones en una aplicación web.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <span className="step-number">(05)</span>
                            <div>
                                <h3>Revisa y prueba tu proyecto.</h3>
                                <p>
                                    Comprueba que todo funciona correctamente y realiza
                                    los cambios necesarios antes de publicarlo.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <span className="step-number">(06)</span>
                            <div>
                                <h3>Despliega tu aplicación web.</h3>
                                <p>
                                    Publica tu proyecto para que otras personas puedan
                                    acceder y utilizar tu aplicación.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;