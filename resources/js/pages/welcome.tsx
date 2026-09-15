import { Head } from '@inertiajs/react';
import SignageStrip from './welcome/SignageStrip';
import Navigation from './welcome/Navigation';
import Hero from './welcome/Hero';
import StatsSection from './welcome/StatsSection';
import MotoSection from './welcome/MotoSection';
import ServiceSection from './welcome/ServiceSection';
import TenantMarquee from './welcome/TenantMarquee';
import FacilitySection from './welcome/FacilitySection';
import QueueSkmSection from './welcome/QueueSkmSection';
import FlowSection from './welcome/FlowSection';
import ScheduleSection from './welcome/ScheduleSection';
import ReviewSection from './welcome/ReviewSection';
import ComplaintSection from './welcome/ComplaintSection';
import Footer from './welcome/Footer';
import type { WelcomeProps } from './welcome/content';

export type { WelcomeProps };

export default function Welcome({
    tenants,
    stats,
    activeTenantsToday,
    schedule,
    today,
    reviews,
}: WelcomeProps) {
    return (
        <>
            <Head title="Mal Pelayanan Publik · Kabupaten Muara Enim" />

            <div className="bg-background text-foreground flex min-h-screen flex-col">
                <SignageStrip />
                <Navigation />
                <main className="flex-1">
                    <Hero today={today} />
                    <StatsSection
                        stats={stats}
                        activeTenantsToday={activeTenantsToday}
                    />
                    <MotoSection />
                    <ServiceSection />
                    <TenantMarquee tenants={tenants} />
                    <FacilitySection />
                    <QueueSkmSection />
                    <FlowSection />
                    <ScheduleSection schedule={schedule} />
                    <ReviewSection reviews={reviews} />
                    <ComplaintSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
