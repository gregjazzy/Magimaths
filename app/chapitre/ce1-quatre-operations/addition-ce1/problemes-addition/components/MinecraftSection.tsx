import { motion } from 'framer-motion';

export default function MinecraftSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu style Minecraft */}
    </motion.div>
  );
}

