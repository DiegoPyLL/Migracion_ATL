import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carouselHome.css"; 

const CarouselHome: React.FC = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval={5500}>
      <div className="carousel-inner">

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

        <div className="carousel-item">
          <video
            autoPlay
            muted
            loop
            playsInline
            //style={{ width: "100%", height: "600px", objectFit: "cover" }}
          >
            <source
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01k5ss54e0fzcrh9hk58655sdd%2Ftask_01k5ss54e0fzcrh9hk58655sdd_genid_d92fb2ef-b903-4408-834a-a07659778292_25_09_22_22_39_916436%2Fvideos%2F00000_198295585%2Fsource.mp4"
              type="video/mp4"
            />
          </video>
          <div className="texto-sobre-imagen"><h1>Aprovecha mientras puedas</h1>
          <h2>Palabras boinitas</h2></div>
        </div>

        {/* Puedes añadir más items según tu HTML */}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CarouselHome;
