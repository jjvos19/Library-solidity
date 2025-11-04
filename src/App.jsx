import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import abi from './abi/Library.json'
import { ethers } from 'ethers'

const contractAddress = "0xd96c2589c4302cdd30fde4c4b25d6962c557b78e";
function App() {
  const [walletConectada, setWalletConectada] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState("");
//  const [idBook, setIdBook] = useState("");
  
    async function conectarWallet() {
        if (typeof window.ethereum === "undefined") {
            alert("Por favor instala MetaMask");
            return;
        }

        try {
            const cuentas = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            console.log("Cuenta conectada!!" + cuentas[0]);
            setWalletConectada(cuentas[0]);
        } catch (error) {
            console.error("Error al conectar la wallet: ", error);
        }
    }
    
    async function registrarLibro(){
        if (!window.ethereum){
            alert("Instalar Metamask");
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contrato = new ethers.Contract(contractAddress, abi, signer);
        try {
            const tx = await contrato.SaveBook(title, author, publisher, year);
            await tx.wait();
            setTitle("");
            setAuthor("");
            setPublisher("");
            setYear("");
        } catch(error){
            alert(error.reason);
        } 
        listrarLibros();
    }
    
    async function listrarLibros(){
        if (!window.ethereum){
            alert("Instalar Metamask");
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contrato = new ethers.Contract(contractAddress, abi, provider);
        const list = await contrato.listBooks();
        setBooks(list);
    }
    
    async function prestarLibro(idBook){
        if (!window.ethereum){
            alert("Instalar Metamask");
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contrato = new ethers.Contract(contractAddress, abi, signer);
        try{
            const tx = await contrato.onLoan(idBook);
            await tx.wait();
        } catch(error){
            alert(error.reason);
        }
        listrarLibros();
    }

  return (
    <div class="container">
        <h1>Libreria - Blockchain</h1>
        <button class="btn-connect" onClick={conectarWallet}>Conectar Wallet</button>
        {
            walletConectada && (
                    <div class="wallet-info"><strong>Wallet Conectada: </strong>{walletConectada}</div>
            )
        }
        <hr size="-1"/>
        <h1>Registrar Libro</h1>
        <table>
        <thead>
            <tr>
                <th>Title</th><th>Author</th><th>Publisher</th><th>Year</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th><input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)}/></th>
                <th><input type="text" name="author" value={author} onChange={(e) => setAuthor(e.target.value)}/></th>
                <th><input type="text" name="title" value={publisher} onChange={(e) => setPublisher(e.target.value)}/></th>
                <th><input type="number" name="title" value={year} onChange={(e) => setYear(e.target.value)}/></th>
            </tr>
        </tbody>
        <tfoot>
            <tr><th colspan="4"><button class="btn-primary" onClick={registrarLibro}>Registrar</button></th></tr>
        </tfoot>
        </table>
        <hr size="-1"/>
        <h1>Lista Libros</h1>
        <button class="btn-carga" onClick={listrarLibros}>Cargar Libros</button>
         
        <table border="-1">
        <thead>
            <tr>
                <th>Id</th><th>Title</th><th>Author</th><th>Publisher</th><th>Year</th><th>Loan</th>
            </tr>
        </thead>
        <tbody>        
        { books.length === 0 ? (
            <tr>
                <th colspan="6"><h1 class="msg-alerta">No se tiene lista de libros</h1></th>
            </tr>
        ) : ( 
        books.map((bk, index) => (
                <tr>
                    <th>{bk.id}</th>
                    <td>{bk.title}</td>
                    <td>{bk.author}</td>
                    <td>{bk.publisher}</td>
                    <td>{bk.year}</td>
                    <td>
                        <button class={bk.loan ? "btn-prestado" : "btn-noprestado" } onClick={(e) => prestarLibro(e.target.value)} value={bk.id}>{bk.loan ? "Yes": "No"}</button>
                    </td>
                </tr>
        ))
        )}
        </tbody>
        <tfoot>
            <tr>
                <th class="title-sum" colspan="5">Cantidad Libros: </th>
                <th class="title-sum">{books.length}</th>
            </tr>
        </tfoot>
        </table>
        
    </div>
  );
}

export default App
