import { useEffect, useState } from "react";
import Container from "../../Components/Container";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../Services/firebaseConnection";
import { Link } from "react-router";
import ilustreCar from "../../assets/ilustracao.png";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export default function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [searchR, setSearchR] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      let listCars = [] as CarsProps[];

      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });

      setCars(listCars);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      setSearchR("");
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff") // garante que vai incluir todos os caracteres da string
    );

    const querySnapshot = await getDocs(q);

    let listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid,
      });
    });

    if (listCars.length === 0) {
      setSearchR("Nenhum carro foi encontrado...");
      return;
    }

    setSearchR("");

    setCars(listCars);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="cursor-pointer bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg transition-all duration-300 ease-in-out hover:scale-95"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4 text-zinc-600">
        {searchR ? searchR : "Carros novos e usados em todo o Brasil"}
      </h1>

      {cars.length === 0 ? (
        <main className="w-full flex flex-col items-center justify-center gap-4">
          <img src={ilustreCar} className="mt-10 w-50" />
          <h1 className="font-bold text-center mt-6 text-2xl mb-4 text-zinc-600">
            {searchR ? "" : "Nenhum carro cadastrado"}
          </h1>
        </main>
      ) : (
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Link key={car.id} to={`/Car/${car.id}`}>
              <section className="w-full bg-white rounded-lg">
                <div
                  className="w-full h-72 rounded-lg bg-slate-200"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "block",
                  }}
                ></div>

                <img
                  className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                  src={car.images[0].url}
                  alt="carro"
                  onLoad={() => handleImageLoad(car.id)}
                  style={{
                    display: loadImages.includes(car.id) ? "block" : "none",
                  }}
                />
                <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                <div className="flex flex-col px-2">
                  <span className="text-zinc-700 mb-6">
                    Ano {car.year} - {car.km} km
                  </span>
                  <strong className="text-black font-medium text-xl">
                    R$ {car.price}
                  </strong>
                </div>

                <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2">
                  <span className="text-zinc-700">{car.city}</span>
                </div>
              </section>
            </Link>
          ))}
        </main>
      )}
    </Container>
  );
}
