import { FaFacebookF, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-8 md:mb-0">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold"
          >
            ForUS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 text-gray-400"
          >
            Descrição aqui.
          </motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-2">Links Rápidos</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Ajuda
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-2">Links Rápidos</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Ajuda
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-2">Links Rápidos</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Ajuda
                </a>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-2">Siga-nos</h2>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-green-500 transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <FaInstagram />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-8 pt-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-gray-400">
            © 2024 Nexus JR. Todos os direitos reservados.
          </p>
          <a
            href="#"
            className="flex items-center justify-center text-green-500 hover:text-green-600 transition-colors mt-2"
          >
            <FaArrowUp className="mr-1" /> Voltar ao topo
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
