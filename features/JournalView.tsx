
import React from 'react';
import { Camera, Heart, MessageCircle, Share2 } from 'lucide-react';

const JournalView: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Travel Memories</h2>
        <button className="flex items-center gap-2 bg-[#8BAE8E] text-white px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform">
          <Camera size={18} /> Add Note
        </button>
      </div>

      {[
        { 
          id: 1, 
          author: 'Alex', 
          date: 'Oct 24, 2024', 
          text: 'The sunset at Asakusa was breathtaking! So glad we made it here.', 
          images: ['https://picsum.photos/seed/jap1/600/400', 'https://picsum.photos/seed/jap2/600/400'],
          likes: 5 
        },
        { 
          id: 2, 
          author: 'Me', 
          date: 'Oct 25, 2024', 
          text: 'Found the cutest stationery shop! 🖊️✨', 
          images: ['https://picsum.photos/seed/jap3/600/400'],
          likes: 2 
        }
      ].map((post) => (
        <div key={post.id} className="mori-card mori-shadow overflow-hidden bg-white">
          <div className="p-4 flex items-center gap-3">
            <img src={`https://picsum.photos/seed/${post.author}/50`} className="w-10 h-10 rounded-full border-2 border-[#E0E5D5]" alt="User" />
            <div>
              <p className="font-bold text-sm">{post.author}</p>
              <p className="text-[10px] text-gray-400">{post.date}</p>
            </div>
          </div>
          
          <div className="px-4 mb-4">
            <p className="text-sm leading-relaxed text-[#5D5443]">{post.text}</p>
          </div>

          <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 bg-[#F7F4EB]`}>
            {post.images.map((img, i) => (
              <img key={i} src={img} className="w-full aspect-square object-cover" alt="Memory" />
            ))}
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
                <Heart size={18} /> {post.likes}
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle size={18} />
              </button>
            </div>
            <button className="text-gray-400">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalView;
