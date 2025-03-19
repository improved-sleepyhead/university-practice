import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductProps {
  product: { id: number; title: string; price: number; image: string; description: string };
}

export const ProductCard = ({ product }: ProductProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition p-2">
      <CardHeader className="p-0">
        <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded-t-md" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{product.title}</CardTitle>
        <p className="text-gray-600 text-sm">${product.price}</p>
        <p className="text-gray-500 text-sm mt-2">{product.description}</p>
      </CardContent>
    </Card>
  );
};