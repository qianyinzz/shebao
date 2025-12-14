export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tailwind CSS 测试</h1>
        <p className="text-gray-600">如果您能看到蓝色背景和白色卡片，说明 Tailwind CSS 正常工作</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          测试按钮
        </button>
      </div>
    </div>
  )
}