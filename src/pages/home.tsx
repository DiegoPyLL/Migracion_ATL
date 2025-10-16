import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Home: React.FC = () => {
  return (
    <div>
      {/* Carrusel */}
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval={5500}
      >
        <div className="carousel-inner">
          {/* Imagen 1 */}
          <div className="carousel-item active">
            <img
              src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/familia_feliz1.png?raw=true"
              className="d-block w-100"
              alt="Familia feliz"
            />
            <div className="texto-sobre-imagen">
              <h1>Nunca sabes cuando termina</h1>
              <h2>Contrata nuestro seguro de vida con nosotros</h2>
            </div>
          </div>

          {/* Video 1 */}
          <div className="carousel-item">
            <div>
              <video
                src="https://videos.openai.com/vg-assets/assets%2Ftask_01k5ss54e0fzcrh9hk58655sdd%2Ftask_01k5ss54e0fzcrh9hk58655sdd_genid_d92fb2ef-b903-4408-834a-a07659778292_25_09_22_22_39_916436%2Fvideos%2F00000_198295585%2Fsource.mp4?st=2025-09-22T21%3A06%3A48Z&se=2025-09-28T22%3A06%3A48Z&sks=b&skt=2025-09-22T21%3A06%3A48Z&ske=2025-09-28T22%3A06%3A48Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=LZ7sjWJzYbVS1RK3Jq8rvOlbw73LPfGh7iuWyopC%2F74%3D&az=oaivgprodscus"
                autoPlay
                muted
                loop
                playsInline
                //style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
              ></video>
              <div className="texto-sobre-imagen">Aprovecha mientras puedas</div>
            </div>
          </div>

          {/* Imagen 2 */}
          <div className="carousel-item">
            <img
              src="https://github.com/DiegoPyLL/Pagina_Clinica_a_tu_Lado/blob/main/imagenes/seguro_1.png?raw=true"
              className="d-block w-100"
              alt="Seguro"
            />
            <div className="texto-sobre-imagen">
              <h1>Con nuestros seguros</h1>
              <h2>No te pillan</h2>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
          title="Previous slide"
          aria-label="Previous slide"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
          title="Next slide"
          aria-label="Next slide"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Botón de reserva */}
      <div className="text-center my-4">
        <Link to="/reserva" className="boton-reserva">
          Reservar hora Atención Médica
        </Link>
      </div>

      {/* Sección de seguros */}
      <div className="card text-center">
        <h1>Contrata tu Seguro 100% Online</h1>
        <div className="card-body">
          {/* Seguro 1 */}
          <div className="card mb-5">
            <div className="card-header">Seguro de Salud Premium</div>
            <div className="card-body">
              <video
                src="https://videos.openai.com/vg-assets/assets%2Ftask_01k5hxtprhf7ztc9ddm0h397t0%2Ftask_01k5hxtprhf7ztc9ddm0h397t0_genid_e41e8133-8c2c-4595-a7a9-0879c70ef318_25_09_19_21_24_517028%2Fvideos%2F00000_819540294%2Fsource.mp4?st=2025-09-22T21%3A02%3A03Z&se=2025-09-28T22%3A02%3A03Z&sks=b&skt=2025-09-22T21%3A02%3A03Z&ske=2025-09-28T22%3A02%3A03Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=as3NHHGpgTZFPLNM91s8to8E6podhIjt4wNGRl%2B2m8s%3D&az=oaivgprodscus"
                autoPlay
                muted
                loop
                playsInline
                //style={{ width: "80%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
              ></video>
              <h5 className="card-title mt-2">Cobertura completa</h5>
              <p className="card-text">Incluye consultas, hospitalización y emergencias.</p>
              <Link to="/seguros/venta" className="btn btn-primary">
                Contrátalo aquí
              </Link>
            </div>
          </div>

          {/* Seguro 2 */}
          <div className="card mb-5">
            <div className="card-header">Seguro de Salud Básico</div>
            <div className="card-body">
              <video
                src="https://videos.openai.com/vg-assets/assets%2Ftask_01k5ss8vg2e1rvrnftypgz90h6%2Ftask_01k5ss8vg2e1rvrnftypgz90h6_genid_dc4bed9e-8fa0-4aa9-8806-bcd370df1c81_25_09_22_22_39_451437%2Fvideos%2F00000_269393005%2Fsource.mp4?st=2025-09-22T21%3A02%3A04Z&se=2025-09-28T22%3A02%3A04Z&sks=b&skt=2025-09-22T21%3A02%3A04Z&ske=2025-09-28T22%3A02%3A04Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=871tgcvU2%2B8jIAPij5FDRJBo7ELKXYwfFE29wEkTH9c%3D&az=oaivgprodscus"
                autoPlay
                muted
                loop
                playsInline
                //style={{ width: "80%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
              ></video>
              <h5 className="card-title mt-2">Plan económico</h5>
              <p className="card-text">Cubre consultas y medicamentos esenciales.</p>
              <Link to="/seguros/venta" className="btn btn-primary">
                Contrátalo aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
