<?php

namespace App\Http\Controllers;

use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends Controller
{
    public function show(Request $request, string $path): StreamedResponse
    {
        /** @var S3Client $client */
        $client = Storage::disk('minio')->getClient();
        $bucket = (string) config('filesystems.disks.minio.bucket');

        try {
            $head = $client->headObject([
                'Bucket' => $bucket,
                'Key' => $path,
            ]);
        } catch (\Throwable) {
            abort(404);
        }

        $size = (int) ($head['ContentLength'] ?? 0);
        $mime = (string) ($head['ContentType'] ?? 'application/octet-stream');
        $range = $request->header('Range');

        $baseHeaders = [
            'Content-Type' => $mime,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ];

        if ($range && preg_match('/bytes=(\d+)-(\d*)/i', (string) $range, $m)) {
            $start = (int) $m[1];
            $end = $m[2] !== '' ? (int) $m[2] : $size - 1;

            if ($start > $end || $start >= $size) {
                abort(416, 'Range Not Satisfiable');
            }

            $end = min($end, $size - 1);
            $chunkSize = $end - $start + 1;

            return response()->stream(
                function () use ($client, $bucket, $path, $start, $end) {
                    $result = $client->getObject([
                        'Bucket' => $bucket,
                        'Key' => $path,
                        'Range' => "bytes={$start}-{$end}",
                    ]);
                    $body = $result['Body'];

                    while (! $body->eof()) {
                        echo $body->read(64 * 1024);
                    }
                },
                206,
                array_merge($baseHeaders, [
                    'Content-Range' => "bytes {$start}-{$end}/{$size}",
                    'Content-Length' => $chunkSize,
                ]),
            );
        }

        return response()->stream(
            function () use ($client, $bucket, $path) {
                $result = $client->getObject([
                    'Bucket' => $bucket,
                    'Key' => $path,
                ]);
                $body = $result['Body'];

                while (! $body->eof()) {
                    echo $body->read(64 * 1024);
                }
            },
            200,
            array_merge($baseHeaders, [
                'Content-Length' => $size,
            ]),
        );
    }
}
