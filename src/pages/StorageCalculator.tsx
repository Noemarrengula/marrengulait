import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  HardDrive, 
  Camera, 
  Clock, 
  Check,
  AlertCircle,
  Info,
  Wifi,
  Shield
} from "lucide-react";

interface StorageResult {
  days: number;
  hddSize: number;
  quality: string;
  recommended: string;
}

const StorageCalculator = () => {
  const [cameras, setCameras] = useState(4);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [daysToKeep, setDaysToKeep] = useState(7);
  const [resolution, setResolution] = useState<"1080p" | "4mp" | "5mp">("4mp");
  const [motionOnly, setMotionOnly] = useState(false);

  const calculateStorage = (): StorageResult => {
    const resolutions: Record<string, { bitrate: number; label: string }> = {
      "1080p": { bitrate: 4, label: "Full HD 1080p" },
      "4mp": { bitrate: 6, label: "4MP" },
      "5mp": { bitrate: 8, label: "5MP" },
    };

    const res = resolutions[resolution];
    const motionFactor = motionOnly ? 0.3 : 1;
    
    const bitsPerSecond = cameras * res.bitrate * 1024 * 1024;
    const secondsPerDay = hoursPerDay * 3600 * motionFactor;
    const bitsPerDay = bitsPerSecond * secondsPerDay;
    const bytesPerDay = bitsPerDay / 8;
    const totalBytes = bytesPerDay * daysToKeep;
    const hddSizeGB = totalBytes / (1024 * 1024 * 1024);
    const hddSizeTB = hddSizeGB / 1024;

    const recommendedSizes = [
      { size: 1, label: "1TB", suitable: hddSizeGB <= 1000 },
      { size: 2, label: "2TB", suitable: hddSizeGB <= 2000 && hddSizeGB > 1000 },
      { size: 4, label: "4TB", suitable: hddSizeGB <= 4000 && hddSizeGB > 2000 },
      { size: 6, label: "6TB", suitable: hddSizeGB <= 6000 && hddSizeGB > 4000 },
      { size: 8, label: "8TB", suitable: hddSizeGB > 6000 },
    ];

    const recommended = recommendedSizes.find(r => r.suitable)?.label || "8TB+";

    return {
      days: daysToKeep,
      hddSize: Math.ceil(hddSizeGB),
      quality: res.label,
      recommended,
    };
  };

  const result = calculateStorage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#FF3131] to-[#FF5555] py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <Calculator className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Calculadora de Armazenamento CCTV
          </h1>
          <p className="text-lg opacity-90">
            Descubra quanto espaço de armazenamento precisa para o seu sistema
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-6 w-6 text-[#FF3131]" />
                Configuração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Cameras */}
              <div>
                <Label className="flex items-center gap-2 mb-4">
                  <Camera className="h-4 w-4" />
                  Número de Câmaras: {cameras}
                </Label>
                <Slider
                  value={[cameras]}
                  onValueChange={(v) => setCameras(v[0])}
                  min={1}
                  max={16}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span>16</span>
                </div>
              </div>

              {/* Hours per Day */}
              <div>
                <Label className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4" />
                  Horas de Gravação por Dia: {hoursPerDay}h
                </Label>
                <Slider
                  value={[hoursPerDay]}
                  onValueChange={(v) => setHoursPerDay(v[0])}
                  min={1}
                  max={24}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1h</span>
                  <span>24h (Contínua)</span>
                </div>
              </div>

              {/* Days to Keep */}
              <div>
                <Label className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  Dias para Manter: {daysToKeep}
                </Label>
                <Slider
                  value={[daysToKeep]}
                  onValueChange={(v) => setDaysToKeep(v[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 dia</span>
                  <span>30 dias</span>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <Label className="mb-4 block">Resolução</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1080p", "4mp", "5mp"] as const).map((res) => (
                    <Button
                      key={res}
                      variant={resolution === res ? "default" : "outline"}
                      className={resolution === res ? "bg-[#FF3131]" : ""}
                      onClick={() => setResolution(res)}
                    >
                      {res === "1080p" ? "1080p" : res.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Motion Only */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Apenas com Movimento</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduz armazenamento em ~70%
                  </p>
                </div>
                <Button
                  variant={motionOnly ? "default" : "outline"}
                  className={motionOnly ? "bg-[#FF3131]" : ""}
                  onClick={() => setMotionOnly(!motionOnly)}
                >
                  {motionOnly ? <Check className="h-4 w-4" /> : "Off"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="border-2 border-[#FF3131]">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-black text-[#FF3131] mb-2">
                  {result.hddSize > 1000 
                    ? `${(result.hddSize / 1024).toFixed(1)} TB` 
                    : `${result.hddSize} GB`}
                </div>
                <p className="text-muted-foreground">Espaço necessário</p>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolução:</span>
                  <span className="font-medium">{result.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Câmaras:</span>
                  <span className="font-medium">{cameras}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dias de gravação:</span>
                  <span className="font-medium">{daysToKeep}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gravação:</span>
                  <span className="font-medium">
                    {motionOnly ? "Apenas movimento" : `${hoursPerDay}h/dia`}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-800">
                  HDD Recomendado: {result.recommended}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Adequado para {cameras} câmaras @ {result.quality}
                </p>
              </div>

              <Button className="w-full bg-[#FF3131] hover:bg-[#FF5555] py-6 text-lg">
                Adicionar ao Kit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Nota:</strong> Os valores são estimativas baseadas em condições típicas de uso. 
                  O consumo real pode variar dependendo da complexidade da cena, compressão используемого codec, 
                  e configurações específicas do equipamento.
                </p>
                <p>
                  Para sistemas profissionais ou com requisitos específicos, consulte nossa equipe técnica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default StorageCalculator;
