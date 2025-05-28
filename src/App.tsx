import AutofillInput from './components/AutofillInput';
import { dummyData, Item } from './data/dummyData';

function App() {
  const handleSelect = (item: Item) => {
    console.log('Selected item:', item);
  };

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">React Autofill Search</h1>
        <AutofillInput 
          data={dummyData}
          placeholder="Search React topics..."
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}

export default App;
