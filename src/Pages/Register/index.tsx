import { Link, useNavigate } from 'react-router';
import logoImg from '../../assets/logo.svg'
import Container from "../../Components/Container";
import { Input } from '../../Components/Input';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { auth } from '../../Services/firebaseConnection';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("O campo senha é obrigatório"),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { handleInfoUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
      async function handleLogout() {
        await signOut(auth)
      }
  
      handleLogout()
    }, [])

  function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) => {
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid,
      })
      console.log("Cadastrado com sucesso!");
      toast.success("Bem vindo ao WebCarros!")
      navigate("/User", { replace: true })
    })
    .catch((error) => {
      console.log("Erro ao cadastrar este usuário");
      console.log(error);
      toast.error("Erro ao cadastrar usuário!")
    })
  }

  return (
    <Container>
      <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
        <Link to="/" className='mb-6 max-w-sm w-full'>
          <img src={logoImg} alt="logo do site" className='w-full' />
        </Link>

        <form className='bg-white max-w-xl w-full rounded-lg p-4'
        onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type="password"
              placeholder="Digite seu senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium cursor-pointer'>Cadastrar</button>
        </form>

        <Link to="/Login">Já possui uma conta? Faça o login!</Link>
      </div>
    </Container>
  );
}
