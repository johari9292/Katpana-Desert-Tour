import CarRental from "./CarRental";
import HotelBooking from "./HotelBooking";
import Testimonials from "./Testimonials";
import VideoShowcase from "./VideoShowcase";

/**
 * These sections are server-rendered so their content remains available to
 * search engines and no placeholder collapses during hydration. CSS skips
 * below-the-fold paint work until each stable-size wrapper approaches view.
 */
export default function DeferredLandingSections() {
  return (
    <>
      <div className="deferred-section deferred-section-video">
        <VideoShowcase />
      </div>
      <div className="deferred-section deferred-section-form">
        <HotelBooking />
      </div>
      <div className="deferred-section deferred-section-rental">
        <CarRental />
      </div>
      <div className="deferred-section deferred-section-testimonials">
        <Testimonials />
      </div>
    </>
  );
}
