import { motion } from 'framer-motion';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'Обновление лаунчера v1.0',
    excerpt: 'Полностью переписан на Rust с максимальной производительностью',
    date: '2024-02-07',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
  },
  {
    id: 2,
    title: 'Новый сервер открыт!',
    excerpt: 'Присоединяйтесь к нашему новому серверу с уникальными модами',
    date: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
  },
  {
    id: 3,
    title: 'Скидки на привилегии',
    excerpt: 'Только сегодня скидка 50% на все VIP статусы',
    date: '2024-02-01',
    image: null,
  },
];

const NewsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Newspaper size={20} className="text-primary" />
          Новости
        </h2>
        <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
          Все новости
          <ArrowRight size={14} />
        </button>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {newsItems.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="group flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            {/* Image */}
            {news.image ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Newspaper size={24} className="text-primary" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                {news.title}
              </h3>
              <p className="text-xs text-white/40 mt-1 line-clamp-2">
                {news.excerpt}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-white/30">
                <Calendar size={10} />
                {news.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NewsSection;
