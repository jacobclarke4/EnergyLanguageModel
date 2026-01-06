import EnergyTree from '../../assets/EnergyTree.svg'

const TreeSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-center">
        <img 
          src={EnergyTree} 
          alt="Energy Tree" 
          className="w-full h-auto max-w-4xl max-h-[600px] object-contain" 
        />
      </div>
    </div>
  )
}

export default TreeSection