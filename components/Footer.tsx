'use client';

import { motion } from 'framer-motion';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Apprentissage',
      links: [
        { name: 'Tous les chapitres', href: '#chapitres' },
        { name: 'Exercices interactifs', href: '#' },
        { name: 'Évaluations', href: '#' },
        { name: 'Progression', href: '#' }
      ]
    },
    {
      title: 'Ressources',
      links: [
        { name: 'Guide d\'utilisation', href: '#' },
        { name: 'Formulaires mathématiques', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Tutoriels vidéo', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Centre d\'aide', href: '#' },
        { name: 'Nous contacter', href: '#' },
        { name: 'Communauté', href: '#' },
        { name: 'Signaler un bug', href: '#' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { name: 'Conditions d\'utilisation', href: '#' },
        { name: 'Politique de confidentialité', href: '#' },
        { name: 'Cookies', href: '#' },
        { name: 'Mentions légales', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MathPremière</span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 leading-relaxed"
            >
              L&apos;application interactive de référence pour maîtriser les mathématiques 
              de première selon le programme français officiel.
            </motion.p>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>contact@mathpremiere.fr</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </motion.div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Restez informé</h3>
              <p className="text-gray-300">
                Recevez les dernières nouveautés et conseils d&apos;apprentissage
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 lg:ml-8">
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-purple-700 transition-all duration-200">
                  S&apos;abonner
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gray-300">
            © {currentYear} MathPremière. Tous droits réservés.
          </div>
          
          {/* Social links */}
          <div className="flex space-x-4">
            {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 