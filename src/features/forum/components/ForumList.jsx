// Forum List Component
import { Card } from '../../../components/ui';

export const ForumList = ({ posts = [], onPostClick }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} hover className="cursor-pointer" onClick={() => onPostClick?.(post.id)}>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-medium text-sm">{post.author?.charAt(0) || 'A'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{post.author} • {post.club}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments} bình luận
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ForumList;
