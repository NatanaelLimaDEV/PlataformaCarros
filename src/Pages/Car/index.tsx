import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { db } from "../../Services/firebaseConnection";
import Container from "../../Components/Container";
import {
  FaLocationArrow,
  FaMapPin,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { FiMail, FiMapPin, FiUser } from "react-icons/fi";

interface CarsProps {
  id: string;
  name: string;
  model: string;
  description: string;
  created: string;
  year: string;
  uid: string;
  price: string | number;
  owner: string;
  city: string;
  km: string;
  whatsapp: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export default function CarDetail() {
  const { id } = useParams(); // id passado na rota
  const [car, setCar] = useState<CarsProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();
  const [carOwner, setCarOwner] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    loadCar();
  }, [id]);

  async function loadCar() {
    if (!id) {
      return;
    }

    const docRef = doc(db, "cars", id);
    getDoc(docRef).then(async (snapshot) => {
      if (!snapshot.data()) {
        navigate("/");
      }

      const userUid = snapshot.data()?.uid;

      if (userUid) {
        const userRef = collection(db, "userCar");
        const queryRef = query(userRef, where("uid", "==", userUid));
        const userSnapshot = await getDocs(queryRef);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setCarOwner({
            name: userData.name,
            email: userData.email,
            contact: userData.contact,
            city: userData.city,
            address: userData.address,
          });
        }
      }

      setCar({
        id: snapshot.id,
        name: snapshot.data()?.name,
        year: snapshot.data()?.year,
        city: snapshot.data()?.city,
        model: snapshot.data()?.model,
        uid: snapshot.data()?.uid,
        description: snapshot.data()?.description,
        created: snapshot.data()?.created,
        whatsapp: snapshot.data()?.whatsapp,
        price: snapshot.data()?.price,
        km: snapshot.data()?.km,
        owner: snapshot.data()?.owner,
        images: snapshot.data()?.images,
      });
    });
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
          className="rounded-lg"
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <div>
          <main className="w-full bg-white rounded-lg p-6 my-4">
            <div className="flex flex-col sm:flex-row mb-1 items-center justify-between">
              <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
              <h1 className="font-bold text-xl text-black sm:text-3xl">
                R$ {car?.price}
              </h1>
            </div>
            <p className="text-ms font-normal text-zinc-500">{car?.model}</p>
            <div className="flex w-full gap-6 my-4">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-normal text-zinc-500">Cidade</p>
                  <strong>{car?.city}</strong>
                </div>
                <div>
                  <p className="text-xs font-normal text-zinc-500">Ano</p>
                  <strong>{car?.year}</strong>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-normal text-zinc-500">KM</p>
                  <strong>{car?.km}</strong>
                </div>
              </div>
            </div>
            <strong className="text-xs font-normal text-zinc-500">
              Descrição
            </strong>
            <p className="mb-4">{car?.description}</p>

            <hr className="border-zinc-300" />

            <a
              href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} no site WebCarros e fiquei interessado!`}
              target="_blank"
              className="w-full flex items-center justify-center bg-red-500 text-white font-medium rounded-lg h-10 mt-4"
            >Tenho Interesse</a>
          </main>
          <main className="w-full bg-white rounded-lg p-6 my-4">
            <p className="text-xs font-medium text-zinc-400">
              Sobre o vendedor
            </p>

            <div className="w-full mt-4 flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-row gap-2">
                <div className="bg-zinc-200 w-12 h-24 flex items-center justify-center rounded-lg">
                  <FiUser size={22} color="#808080" />
                </div>
                <div className="flex flex-col justify-between h-15 items-start">
                  <p className="text-xl font-medium whitespace-nowrap">
                    {carOwner.name}
                  </p>
                  <p className="flex flex-row items-center justify-center gap-1 text-zinc-500 whitespace-nowrap">
                    <FiMapPin size={15} />
                    {carOwner.city}
                  </p>
                </div>
              </div>
              <hr className="w-50 h-px bg-gray-300 border-none mx-0 my-5 sm:w-px sm:h-24 sm:mx-10 sm:my-0" />
              <div className="w-full">
                <p className="text-xs font-medium text-zinc-800 mb-4">
                  Entre em contato
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} no site WebCarros e fiquei interessado!`}
                    target="_blank"
                    className="cursor-pointer w-fit flex items-center justify-center gap-1 text-xl font-medium text-zinc-600"
                  >
                    <FaWhatsapp size={20} />
                    WhatsApp
                  </a>
                  <p className="flex w-fit flex-row items-center justify-center gap-1 text-zinc-600 text-xl font-medium">
                    <FiMail size={20} />
                    {carOwner.email}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </Container>
  );
}
