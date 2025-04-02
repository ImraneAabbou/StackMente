<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class Translate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate {sourceLang} {targetLang}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Translates language files from source to target language using AI (Gemini API).';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sourceLang = $this->argument('sourceLang');
        $targetLang = $this->argument('targetLang');

        $sourcePath = lang_path($sourceLang);
        $targetPath = lang_path($targetLang);

        if (!File::isDirectory($sourcePath)) {
            $this->error("Source language directory '$sourcePath' not found.");
            return 1;
        }

        if (!File::isDirectory($targetPath)) {
            File::makeDirectory($targetPath, 0755, true, true);
        }

        $files = File::files($sourcePath);

        foreach ($files as $file) {
            $this->info("[*] Translating " . $file->getFilename());
            if ($file->getExtension() === 'php') {
                $this->translateFile($file->getRealPath(), $targetPath . '/' . $file->getFilename(), $targetLang);
            }
        }

        $this->info('[+] Translation completed.');
        return 0;
    }

    protected function translateFile($sourceFilePath, $targetFilePath, $targetLang)
    {
        $sourceData = require $sourceFilePath;
        $targetData = $this->translateArray($sourceData, $targetLang);

        $content = "<?php\n\nreturn " . var_export($targetData, true) . ";\n";
        File::put($targetFilePath, $content);
    }

    protected function translateArray(array $sourceArray, $targetLang)
    {
        $targetArray = [];

        foreach ($sourceArray as $key => $value) {
            if (is_array($value)) {
                $targetArray[$key] = $this->translateArray($value, $targetLang);
            } else {
                $targetArray[$key] = $this->translateString($value, $targetLang);
            }
        }

        return $targetArray;
    }

    protected function translateString($sourceString, $targetLang)
    {
        $matches = [];
        preg_match_all('/(:[a-zA-Z0-9_]+)/', $sourceString, $matches);
        $placeholders = $matches[0];
        $textToTranslate = str_replace($placeholders, '', $sourceString);

        $apiKey = config('services.gemini.api_key');
        $apiEndpoint = config('services.gemini.api_endpoint');

        if (!$apiKey || !$apiEndpoint) {
            $this->error('Gemini API key or endpoint not configured.');
            return $sourceString;
        }

        $prompt = "Translate the following text to $targetLang, keeping any words that start with a colon intact: " . $textToTranslate;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-goog-api-key' => $apiKey,
            ])->post($apiEndpoint, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
            ]);

            $response->throw();

            $translatedText = $response->json('candidates.0.content.parts.0.text');

            return str_replace(array_map(function($placeholder){return trim($placeholder);},array_unique($placeholders)) , array_unique($placeholders), $translatedText);

        } catch (\Exception $e) {
            $this->error('Translation failed: ' . $e->getMessage());
            return $sourceString;
        }
    }
}
