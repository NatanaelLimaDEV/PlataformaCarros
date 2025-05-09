import { useContext, useEffect } from "react";
import Container from "../../Components/Container";
import { AuthContext } from "../../Contexts/AuthContext";
import { Input } from "../../Components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardHeader } from "../../Components/PanelHeader";
import { FiCheck } from "react-icons/fi";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Services/firebaseConnection";
import { signOut, updatePassword } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const schemaDataUser = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

const schemaPassword = z
  .object({
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .nonempty("Campo obrigatório"),
    passwordConfirm: z.string().nonempty("Campo obrigatório"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  });

type FormDataUser = z.infer<typeof schemaDataUser>;
type FormDataPassword = z.infer<typeof schemaPassword>;

export default function User() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: errorsUser },
    reset: resetUser,
  } = useForm<FormDataUser>({
    resolver: zodResolver(schemaDataUser),
    mode: "onChange",
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm<FormDataPassword>({
    resolver: zodResolver(schemaPassword),
    mode: "onChange",
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.uid) {
        return;
      }

      const userRef = collection(db, "userCar");
      const queryRef = query(userRef, where("uid", "==", user?.uid));
      const snapshot = await getDocs(queryRef);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        resetUser({
          name: data.name,
          email: data.email,
          address: data.address,
          city: data.city,
          contact: data.contact,
        });
      } else {
        resetUser({
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
        });
      }
    }

    loadData();
  }, [user?.uid, resetUser]);

  async function onSubmitDataUser(data: FormDataUser) {
    const userRef = collection(db, "userCar");
    const q = query(userRef, where("uid", "==", user?.uid));

    try {
      const querySnapshot = await getDocs(q);

      const newData = {
        name: data.name || user?.name,
        email: data.email || user?.email,
        contact: data.contact || "Não informado",
        address: data.address || "Não informado",
        city: data.city || "Não informado",
        uid: user?.uid,
      };

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "userCar", docId), newData);
      } else {
        await addDoc(userRef, newData);
      }

      resetUser({
        name: newData.name ?? undefined,
        email: newData.email ?? undefined,
        address: newData.address,
        city: newData.city,
        contact: newData.contact,
      });
      toast.success("Dados alterados com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Não foi possível alterar os dados!");
    }
  }

  function onSubmitPasswordUser(data: FormDataPassword) {
    const currentUser = auth.currentUser;

    if (currentUser) {
      updatePassword(currentUser, data.passwordConfirm)
        .then(async () => {
          toast.success("Senha alterada com sucesso!");
          await signOut(auth);
          navigate("/Login", { replace: true });
        })
        .catch((error) => {
          console.error("Erro ao atualizar a senha", error);
        });
    }
  }

  return (
    <Container>
      <DashboardHeader select={3} />

      <main className="w-full bg-white rounded-lg p-6 my-4">
        <h1 className="font-bold text-xl">Alterar dados do usuário</h1>
        <form onSubmit={handleSubmitUser(onSubmitDataUser)}>
          <div className="flex flex-row w-full gap-5">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Nome</p>
              <Input
                type="text"
                register={registerUser}
                name="name"
                error={errorsUser.name?.message}
                placeholder="Ex: José"
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Email</p>
              <Input
                type="text"
                register={registerUser}
                name="email"
                error={errorsUser.email?.message}
                placeholder="Ex: valido@valido.com"
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Contato</p>
              <Input
                type="text"
                register={registerUser}
                name="contact"
                error={errorsUser.contact?.message}
                placeholder="Ex: (88) 99999-9999"
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-5">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Rua</p>
              <Input
                type="text"
                register={registerUser}
                name="address"
                error={errorsUser.address?.message}
                placeholder="Ex: Rua principal"
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={registerUser}
                name="city"
                error={errorsUser.city?.message}
                placeholder="Ex: Fortaleza"
              />
            </div>
          </div>
          <button
            className="w-full bg-zinc-900 text-white font-medium flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer"
            type="submit"
          >
            Confirmar alteração
            <FiCheck size={25} color="#fff" />
          </button>
        </form>
      </main>
      <main className="w-full bg-white rounded-lg p-6 my-4">
        <h1 className="font-bold text-xl">Alterar senha</h1>
        <form onSubmit={handleSubmitPassword(onSubmitPasswordUser)}>
          <div className="flex flex-row w-full gap-5">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Senha</p>
              <Input
                type="password"
                register={registerPassword}
                name="password"
                error={errorsPassword.password?.message}
                placeholder="******"
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Confirmar senha</p>
              <Input
                type="password"
                register={registerPassword}
                name="passwordConfirm"
                error={errorsPassword.passwordConfirm?.message}
                placeholder="******"
              />
            </div>
          </div>
          <button
            className="w-full bg-zinc-900 text-white font-medium flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer"
            type="submit"
          >
            Confirmar alteração
            <FiCheck size={25} color="#fff" />
          </button>
        </form>
      </main>
    </Container>
  );
}
