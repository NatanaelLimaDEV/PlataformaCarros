import { FiTrash2 } from "react-icons/fi";
import Container from "../../Components/Container";
import { DashboardHeader } from "../../Components/PanelHeader";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../Services/firebaseConnection";
import { AuthContext } from "../../Contexts/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";
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

export default function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadCars();
  }, [user]);

  function loadCars() {
    if (!user?.uid) {
      return;
    }

    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, where("uid", "==", user.uid));

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

  async function handleDeleteCar(car: CarsProps) {
    const docRef = doc(db, "cars", car.id);
    await deleteDoc(docRef);

    car.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((itemCar) => itemCar.id !== car.id));
        toast.success("Carro removido com sucesso!");
      } catch (err) {
        console.log("Erro ao excluir essa imagem!");
      }
    });
  }

  return (
    <Container>
      <DashboardHeader select={1}/>

      {cars.length === 0 ? (
        <main className="w-full flex flex-col items-center justify-center gap-4">
          <img src={ilustreCar} className="mt-10 w-50" />
          <h1 className="font-bold text-center mt-6 text-2xl mb-4 text-zinc-600">
            Nenhum carro cadastrado
          </h1>
        </main>
      ) : (
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <section
              key={car.id}
              className="w-full bg-white rounded-lg relative"
            >
              {/* <div
          className="w-full h-72 rounded-lg bg-slate-200"
          style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
        ></div> */}

              <button
                onClick={() => handleDeleteCar(car)}
                className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow cursor-pointer"
              >
                <FiTrash2 size={26} color="#000" />
              </button>
              <img
                className="w-full rounded-lg mb-2 max-h-70"
                src={car.images[0].url}
                alt="carro"
                // onLoad={() => handleImageLoad(car.id)}
                // style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
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
          ))}
        </main>
      )}
    </Container>
  );
}
