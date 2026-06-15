import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Smartphone, CreditCard } from "lucide-react";

interface PaymentProofUploadProps {
  paymentMethod: "mpesa" | "emola" | "transfer";
  amount: number;
  orderId: string;
  onProofUploaded: (proofUrl: string, proofData: { method: string; reference: string; message: string }) => void;
  onCancel: () => void;
}

const M_PESA_NUMBER = "845 807 880";
const E_MOLA_NUMBER = "864 738 133";

export default function PaymentProofUpload({
  paymentMethod,
  amount,
  orderId,
  onProofUploaded,
  onCancel
}: PaymentProofUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const phoneNumber = paymentMethod === "mpesa" ? M_PESA_NUMBER : E_MOLA_NUMBER;
  const methodName = paymentMethod === "mpesa" ? "M-Pesa" : "E-Mola";
  const methodColor = paymentMethod === "mpesa" ? "text-green-600" : "text-orange-600";
  const methodBg = paymentMethod === "mpesa" ? "bg-green-100" : "bg-orange-100";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Erro", description: "Por favor, selecione uma imagem", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erro", description: "A imagem deve ter no máximo 5MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const fileName = `proofs/${orderId}_${Date.now()}.${file.name.split(".").pop()}`;
      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(data.path);
      setUploadedFileUrl(urlData.publicUrl);
      toast({ title: "Imagem carregada com sucesso!" });
    } catch (error: unknown) {
      console.error("Erro ao fazer upload:", error);
      toast({ title: "Erro ao carregar imagem", description: "Tente novamente ou envie apenas a mensagem", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!paymentMessage.trim()) {
      toast({ title: "Erro", description: "Por favor, cole a mensagem de confirmação da transação", variant: "destructive" });
      return;
    }

    const proofData = {
      method: paymentMethod,
      reference: paymentReference.trim(),
      message: paymentMessage.trim(),
    };

    onProofUploaded(uploadedFileUrl || "", proofData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {paymentMethod === "mpesa" ? (
            <Smartphone className={`h-6 w-6 ${methodColor}`} />
          ) : (
            <CreditCard className={`h-6 w-6 ${methodColor}`} />
          )}
          Pagamento via {methodName}
        </CardTitle>
        <CardDescription>
          Complete o pagamento e envie o comprovativo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className={`${methodBg} p-4 rounded-lg text-center`}>
          <p className="text-sm font-medium mb-2">Valor a pagar:</p>
          <p className={`text-3xl font-bold ${methodColor}`}>
            {amount.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" })}
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Instruções:</p>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
            <li>Abra a app {methodName} no seu telemóvel</li>
            <li>Envie o valor exato para o número abaixo</li>
            <li>Copie a mensagem de confirmação</li>
            <li>Cole a mensagem aqui (ou envie um print)</li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
          <p className="text-sm font-medium text-green-800 mb-1">Número para transferência:</p>
          <p className="text-2xl font-bold text-green-600">{phoneNumber}</p>
          <p className="text-sm text-green-600 mt-1">Nome: Marrengula-IT</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => {
              const cleanNumber = phoneNumber.replace(/\s/g, "");
              navigator.clipboard.writeText(cleanNumber);
              toast({ title: "Número copiado!" });
            }}
          >
            Copiar Número
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="proof-upload" className="text-sm font-medium">
              Upload do Comprovativo (opcional)
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center mt-2 cursor-pointer hover:border-primary transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">A carregar imagem...</p>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setUploadedFileUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Imagem carregada</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Arraste uma imagem aqui ou clique para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou WEBP (máx. 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="payment-message" className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Mensagem de Confirmação (obrigatório)
            </Label>
            <Textarea
              id="payment-message"
              value={paymentMessage}
              onChange={(e) => setPaymentMessage(e.target.value)}
              placeholder="Cole aqui a mensagem de confirmação que recebeu. 

Exemplo: Recebeu 2.500,00 MZN de +258 84XXXXXXX. Novo saldo: 1.000,00 MZN. ID: XYZ123456. A(transação) efetuada em 08/04/2026 14:30:15"
              className="mt-2 min-h-[120px]"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Exemplo: "Recebeu 2.500,00 MZN de +258 84XXXXXXX. ID: XYZ123"
            </p>
          </div>

          <div>
            <Label htmlFor="payment-reference" className="text-sm font-medium">
              ID da Transação (opcional)
            </Label>
            <Input
              id="payment-reference"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="XYZ123456"
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!paymentMessage.trim()}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmar Pagamento
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          O seu pedido será processado após confirmação manual do pagamento.
          <br />
          Tempo médio de confirmação: 15-30 minutos em horário comercial.
        </p>
      </CardContent>
    </Card>
  );
}
