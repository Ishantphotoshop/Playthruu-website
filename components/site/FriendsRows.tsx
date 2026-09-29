"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FriendCard } from "@/components/ui";
import { FRIEND_ACTIVITY, NOW_PLAYING } from "@/lib/showcase";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The app's two social rows. On scroll they slide past each other in
// opposite directions, the way a feed feels when it's busy.
export default function FriendsRows() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    function () {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo(".friends__track--a", { xPercent: 0 }, { xPercent: -22, ease: "none", scrollTrigger: st });
        gsap.fromTo(".friends__track--b", { xPercent: -22 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section friends" id="friends" aria-labelledby="friends-title">
      <div className="container section__head">
        <h2 id="friends-title" className="display-2">
          See what your friends are playing.
        </h2>
        <p className="lead">Follow the people whose taste you trust. Their logs, ratings and reviews become your feed.</p>
      </div>

      <div className="friends__row">
        <h3 className="friends__label container">Friends&rsquo; recent activity</h3>
        <div className="friends__viewport">
          <div className="friends__track friends__track--a">
            {[...FRIEND_ACTIVITY, ...FRIEND_ACTIVITY].map((e, i) => (
              <FriendCard key={i} game={e.game} who={e.who} rating={e.rating} review={e.review} />
            ))}
          </div>
        </div>
      </div>

      <div className="friends__row">
        <h3 className="friends__label container">Currently playing</h3>
        <div className="friends__viewport">
          <div className="friends__track friends__track--b">
            {[...NOW_PLAYING, ...NOW_PLAYING].map((e, i) => (
              <FriendCard key={i} game={e.game} who={e.who} status="playing" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
