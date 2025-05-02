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
    public function handle(): int
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
            $this->info('[*] Translating ' . $file->getFilename());
            if ($file->getExtension() === 'php') {
                $this->translateFile($file->getRealPath(), $targetPath . '/' . $file->getFilename(), $targetLang);
            }
        }

        $this->info('[+] Translation completed.');
        return 0;
    }

    /**
     * @param mixed $sourceFilePath
     * @param mixed $targetFilePath
     * @param mixed $targetLang
     */
    protected function translateFile($sourceFilePath, $targetFilePath, $targetLang): void
    {
        $sourceData = require $sourceFilePath;
        $targetData = $this->translateArray($sourceData, $targetLang);

        $content = "<?php\n\nreturn " . var_export($targetData, true) . ";\n";
        File::put($targetFilePath, $content);
    }

    /**
     * @param array<string> $sourceArray
     * @param string $targetLang
     * @return array<array<string>,string>
     */
    protected function translateArray(array $sourceArray, string $targetLang): array
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

    /**
     * @param mixed $sourceString
     * @param mixed $targetLang
     */
    protected function translateString($sourceString, $targetLang): string
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

        $attempt = 0;
        while (true) {
            $attempt++;

            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])->timeout(0)->post($apiEndpoint, [
                    'system_instruction' => [
                        'parts' => [
                            [
                                'text' => "You are a helpful translator. Translate the following text/word to $targetLang, keeping any words that start with a colon intact.",
                            ]
                        ]
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $textToTranslate,
                                ],
                            ],
                        ],
                    ],
                ]);

                $response->throw();

                $translatedText = str_replace(PHP_EOL, '', $response->json('candidates.0.content.parts.0.text'));
                return str_replace(array_map(function ($placeholder) {
                    return trim($placeholder);
                }, array_unique($placeholders)), array_unique($placeholders), $translatedText);
            } catch (\Exception $e) {
                sleep(3);
            }
        }

        return $sourceString;
    }
}
