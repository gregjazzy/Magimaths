import { motion } from 'framer-motion';

export default function FormuleSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu des formules mathématiques */}
    </motion.div>
  );
}

