import React from "react";

const videoSrc = "/videos/Video_Cinematogr\u00E1fico_de_Cl\u00EDnica_Exterior.mp4";

const Historia: React.FC = () => {
  return (
    <section className="container-fluid py-5 bg-white">
      <div className="row justify-content-center align-items-center g-5 px-3 px-lg-5">
        <div className="col-12 col-lg-6">
          <h2 className="fw-bold mb-4">Nuestra Historia</h2>
          
            <p>
              Desde 2010, <strong>Clínica a tu Lado</strong> ha evolucionado de un pequeño centro en Santiago a una red de atención médica integral reconocida por su cercanía y calidad. 
              Nació con una misión clara: ofrecer una salud accesible, humana y confiable. Lo que comenzó con un grupo reducido de profesionales se transformó en una institución moderna, 
              con especialidades diversas, tecnología avanzada y un compromiso constante con el bienestar de las personas.
            </p>

            <p>
              Con los años, expandimos nuestras áreas de atención, incorporando diagnóstico digital, telemedicina, programas de prevención y campañas comunitarias como “Salud en tu Barrio”. 
              Durante la pandemia, nos adaptamos rápidamente, fortaleciendo la atención remota y demostrando que la empatía y la innovación pueden coexistir. 
              Hoy atendemos a miles de pacientes al año, con más de 120 especialistas y sedes que combinan infraestructura moderna con un trato cálido y humano.
            </p>

            <p>
              La pandemia de 2020 fue una prueba decisiva para <strong>Clínica a tu Lado</strong>. En cuestión de semanas, transformamos nuestros espacios, reforzamos la atención de urgencia 
              y lanzamos un servicio de telemedicina que permitió mantener el vínculo con nuestros pacientes cuando más lo necesitaban. Atendimos miles de consultas a distancia, 
              entregando apoyo médico y contención emocional en tiempos de incertidumbre. Esa experiencia marcó un punto de inflexión: aprendimos que estar “a tu lado” no depende de la distancia, 
              sino del compromiso y la vocación por cuidar. Desde entonces, la innovación tecnológica se convirtió en parte esencial de nuestra forma de trabajar, sin perder nunca la calidez humana que nos define.
            </p>


            <p className="mb-0">
              En <strong>Clínica a tu Lado</strong>, creemos que la salud no se limita a curar, sino a acompañar. 
              Cada paciente es escuchado, comprendido y guiado con dedicación. Somos una clínica construida sobre la confianza, 
              la experiencia y el deseo genuino de estar siempre, literalmente, a tu lado.
            </p>





        </div>
        <div className="col-12 col-lg-5 d-flex justify-content-center">
          <div className="ratio ratio-16x9 w-100 shadow rounded overflow-hidden">
            <video
              src={videoSrc}
              className="w-100 h-100 object-fit-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Historia;