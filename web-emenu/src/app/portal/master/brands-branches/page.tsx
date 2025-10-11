import BranchTable from '@/components/BranchTable';

export default function BrandsBranchesPage() {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Brands & Branches</h1>
        <p className="text-sm text-gray-500">Manage your brands and restaurant branches</p>
      </div>
      <BranchTable />
    </div>
  );
}