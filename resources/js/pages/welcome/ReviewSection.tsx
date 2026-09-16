import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type Review } from './content';
import { SectionHeading, Stars, tenantInitials } from './helpers';

const VIDEO_SRC = '/media/testimoni.mp4';
const VIDEO_POSTER = '/img/logo-mpp.png';

type Props = { reviews: Review[] };

export default function ReviewSection({ reviews }: Props) {
    return (
        <section
            id="ulasan"
            className="border-border/70 mx-auto w-full max-w-6xl scroll-mt-20 border-t px-6 py-16 lg:px-8 lg:py-20"
            aria-labelledby="ulasan-title"
        >
            <SectionHeading
                eyebrow="Ulasan"
                title="Kata pengunjung MPP"
                description="Ulasan yang ditampilkan merupakan ulasan asli dan dikelola oleh Admin MPP."
            />

            {/* Video testimoni */}
            <div className="mb-10">
                <video
                    src={VIDEO_SRC}
                    poster={VIDEO_POSTER}
                    className="border-border/70 aspect-video w-full rounded-[1rem] border object-contain shadow-[0_2px_10px_rgba(18,60,134,0.08),0_16px_40px_rgba(18,60,134,0.1)]"
                    controls
                    preload="metadata"
                    aria-label="Video testimoni pengunjung Mal Pelayanan Publik Muara Enim"
                >
                    Browser Anda tidak mendukung pemutaran video.
                </video>
            </div>

            {reviews.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <Card key={review.id} className="flex flex-col">
                            <CardContent className="flex flex-col gap-4 pt-7">
                                <div className="flex items-center justify-between gap-3">
                                    <Stars
                                        rating={review.rating}
                                        label={`${review.rating} dari 5 bintang`}
                                    />
                                </div>
                                <blockquote className="text-foreground text-sm leading-relaxed">
                                    “{review.body}”
                                </blockquote>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarFallback className="bg-accent text-xs font-semibold">
                                            {tenantInitials(review.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">
                                            {review.name}
                                        </p>
                                        {review.origin && (
                                            <p className="text-muted-foreground truncate text-xs">
                                                {review.origin}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
