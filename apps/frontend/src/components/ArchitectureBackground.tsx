import { useEffect, useState, useCallback, useRef, memo, type ReactElement } from 'react';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion, useTransform, useSpring } from 'motion/react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ArchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  canFail?: boolean;
}

interface Connection {
  from: string;
  to: string;
  path: string;
}

// ─── Simplified monochrome icons (SVG path data) ────────────────────────────
// Using simplified icon representations that fit the neon aesthetic
const ICONS: Record<string, ReactElement> = {
  web: (
    <g transform="translate(-12,-12)">
      {/* Laptop Screen */}
      <rect x="4" y="5" width="16" height="11" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 13h16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Laptop Base */}
      <path d="M2 17.5c0-0.8 0.7-1.5 1.5-1.5h17c0.8 0 1.5 0.7 1.5 1.5v0.5c0 0.8-0.7 1.5-1.5 1.5H3.5C2.7 19.5 2 18.8 2 18v-0.5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 16.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Subtle user icon on screen */}
      <circle cx="12" cy="9.5" r="1.5" fill="currentColor" opacity="0.2" />
      <path d="M9 12.5c0-1.5 1.5-1.5 3-1.5s3 0 3 1.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    </g>
  ),
  gateway: (
    <g transform="translate(-12,-12) scale(0.077)">
      <g transform="translate(153, 46)">
        <path d="M103,91.042 L40.848,93.617 L0.559,91.047 L67.199,84.66 L103,91.042" fill="currentColor" opacity="0.4" />
        <path d="M67.055,87.45 L103,91.042 L103,18.636 L67.055,0.661 L64.295,3.641 L64.295,84.369 L67.055,87.45" fill="currentColor" opacity="0.8" />
        <path d="M0.559,18.594 L67.055,0.597 L67.055,87.45 L0.559,91.047 L0.559,18.594" fill="currentColor" opacity="0.6" />
      </g>
      <g transform="translate(0, 46)">
        <path d="M0,91.042 L62.152,93.617 L102.441,91.047 L35.991,83.93 L0,91.042" fill="currentColor" opacity="0.4" />
        <path d="M35.945,87.45 L0,90.935 L0,18.31 L35.945,0.365 L37.6,3.456 L37.6,84.737 L35.945,87.45" fill="currentColor" opacity="0.6" />
        <path d="M102.441,18.594 L35.945,0.597 L35.945,87.45 L102.441,91.047 L102.441,18.594" fill="currentColor" opacity="0.8" />
      </g>
      <g transform="translate(153, 171)">
        <path d="M103,3.486 L40.848,0.91 L0.559,3.481 L66.909,10.188 L103,3.486" fill="currentColor" opacity="1" />
        <path d="M67.055,7.078 L103,3.486 L103,75.891 L67.055,93.866 L65.167,89.755 L65.167,10.772 L67.055,7.078" fill="currentColor" opacity="0.8" />
        <path d="M0.559,75.934 L67.055,93.931 L67.055,7.078 L0.559,3.481 L0.559,75.934" fill="currentColor" opacity="0.6" />
      </g>
      <g transform="translate(0, 171)">
        <path d="M0,3.486 L62.152,0.91 L102.441,3.481 L35.51,10.769 L0,3.486" fill="currentColor" opacity="1" />
        <path d="M35.945,7.078 L0,3.486 L0,75.891 L35.945,93.866 L38.124,90.626 L38.124,10.769 L35.945,7.078" fill="currentColor" opacity="0.6" />
        <path d="M102.441,75.934 L35.945,93.931 L35.945,7.078 L102.441,3.481 L102.441,75.934" fill="currentColor" opacity="0.8" />
      </g>
      <g transform="translate(55, 0)">
        <path d="M40.553,106.629 L73.519,100.848 L139.333,110.167 L145.002,113.428 L113.036,116.926 L40.553,106.629" fill="currentColor" opacity="0.4" />
        <path d="M105.447,106.629 L72.481,100.848 L3.833,111.5 L0.998,113.428 L32.964,116.926 L105.447,106.629" fill="currentColor" opacity="0.4" />
        <path d="M40.553,204.899 L73.519,210.68 L139.167,201.5 L145.002,198.1 L113.036,194.602 L40.553,204.899" fill="currentColor" opacity="1" />
        <path d="M105.447,204.899 L72.481,210.68 L3.333,200.833 L0.998,198.1 L32.964,194.602 L105.447,204.899" fill="currentColor" opacity="1" />
        <path d="M145.002,113.428 L145.002,77.641 L111.289,66.616 L111.289,19.776 L73,0.634 L73,0.635 L71.403,3.178 L71.112,305.766 L73,309.657 L111.289,290.515 L111.289,244.912 L145.002,233.887 L145.002,198.1 L111.289,204.035 L111.289,107.493 L145.002,113.428" fill="currentColor" opacity="0.8" />
        <path d="M34.711,19.776 L34.711,66.616 L0.998,77.641 L0.998,113.428 L34.711,107.493 L34.711,204.035 L0.998,198.1 L0.998,233.887 L34.711,244.912 L34.711,290.515 L73,309.657 L73,0.634 L34.711,19.776" fill="currentColor" opacity="0.6" />
      </g>
    </g>
  ),
  lambda: (
    <g transform="translate(-12,-12) scale(1.5)">
      <path d="M7.983 8.37c-.053.073-.098.133-.141.194L5.775 11.5c-.64.91-1.282 1.82-1.924 2.73a.128.128 0 01-.092.051c-.906-.007-1.813-.017-2.719-.028-.01 0-.02-.003-.04-.006a.455.455 0 01.025-.053 13977.496 13977.496 0 015.446-8.146c.092-.138.188-.273.275-.413a.165.165 0 00.018-.124c-.167-.515-.338-1.03-.508-1.543-.073-.22-.15-.44-.218-.66-.022-.072-.059-.094-.134-.093-.57.002-1.136.001-1.704.001-.108 0-.108 0-.108-.103 0-.674 0-1.347-.002-2.021 0-.075.026-.092.099-.092 1.143.002 2.286.002 3.43 0a.113.113 0 01.076.017.107.107 0 01.045.061 18266.184 18266.184 0 003.92 9.51c.218.53.438 1.059.654 1.59.026.064.053.076.12.056.6-.178 1.2-.352 1.8-.531.075-.023.102-.008.126.064.204.62.412 1.239.62 1.858l.02.073c-.043.015-.083.032-.124.043l-4.085 1.25c-.065.02-.085 0-.106-.054l-1.25-3.048-1.226-2.984-.183-.449c-.01-.026-.023-.048-.043-.087z" fill="currentColor"/>
    </g>
  ),
  server: (
    <g transform="translate(-12,-12)">
      <rect x="4" y="2" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="4" y="10" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="4" y="18" width="16" height="4" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="5" r="1" fill="currentColor"/>
      <circle cx="7" cy="13" r="1" fill="currentColor"/>
    </g>
  ),
  database: (
    <g transform="translate(-12,-12) scale(0.09)">
      <path d="M255.007926,158.085617 C253.473109,153.437413 249.452194,150.199279 244.251788,149.42182 C241.799982,149.055852 238.991667,149.211935 235.668988,149.897164 C229.877358,151.092028 225.580342,151.546679 222.44449,151.635363 C234.280794,131.650217 243.905921,108.859714 249.446873,87.4065589 C258.406282,52.7182633 253.61855,36.9154365 248.023797,29.7669469 C233.217182,10.8477783 211.614448,0.683454965 185.55152,0.371879908 C171.649478,0.202198614 159.443658,2.94725173 153.077358,4.92075751 C147.149155,3.87547344 140.774577,3.29134411 134.08606,3.18315012 C121.550337,2.9833164 110.473164,5.71595381 101.008259,11.332582 C95.7670577,9.56127483 87.3580785,7.06335335 77.6460416,5.46882217 C54.8035104,1.71868822 36.3939769,4.64110855 22.9282587,14.153903 C6.62230023,25.6721293 -0.937090069,45.6838799 0.461154734,73.6339954 C0.904572748,82.5082679 5.86908083,109.507695 13.6850624,135.114199 C18.1771824,149.831538 22.9672794,162.053912 27.9223279,171.443732 C34.9490254,184.758688 42.4676212,192.600092 50.9085266,195.415501 C55.6400924,196.992296 64.2358984,198.09552 73.2774873,190.566873 C74.4232794,191.953885 75.9515935,193.33321 77.9812656,194.613801 C80.5578199,196.239076 83.7090439,197.566965 86.8555381,198.353885 C98.1969885,201.189395 108.820102,200.479926 117.882975,196.506309 C117.93855,198.117986 117.981709,199.658125 118.018365,200.987788 C118.07867,203.145164 118.137792,205.259972 118.217016,207.237617 C118.753848,220.612286 119.663741,231.011326 122.359723,238.286928 C122.507529,238.687778 122.706771,239.29733 122.917247,239.943538 C124.261691,244.062005 126.511298,250.955677 132.232573,256.355326 C138.158411,261.947714 145.325229,263.663446 151.888998,263.662855 C155.180933,263.662855 158.322106,263.231261 161.076619,262.640628 C170.897441,260.536462 182.050291,257.329663 190.118134,245.84218 C197.745515,234.981986 201.453672,218.625182 202.124711,192.851363 C202.211621,192.122975 202.292028,191.427104 202.369478,190.763751 C202.421506,190.316194 202.474716,189.858587 202.528517,189.402162 L204.325838,189.560018 L204.788767,189.591353 C214.791095,190.047187 227.021155,187.925875 234.532065,184.437062 C240.467363,181.68255 259.485857,171.642383 255.007926,158.085617" fill="none" stroke="currentColor" strokeWidth="10"/>
      <path d="M237.905589,160.722476 C208.165838,166.857016 206.121386,156.78788 206.121386,156.78788 C237.521885,110.194697 250.64824,51.0516028 239.320388,36.5766651 C208.417109,-2.90823095 154.921977,15.7655797 154.029229,16.2503834 L153.741894,16.3018199 C147.866309,15.0821247 141.290716,14.3555104 133.900416,14.2349007 C120.443566,14.0143741 110.236083,17.7627344 102.490457,23.636545 C102.490457,23.636545 7.06039723,-15.6768961 11.4987159,73.0806097 C12.4429007,91.9631224 38.5625866,215.954032 69.7171363,178.502947 C81.1041109,164.808425 92.1061986,153.229303 92.1061986,153.229303 C97.5708822,156.859418 104.112776,158.711132 110.970975,158.046005 L111.503667,157.593718 C111.338125,159.294079 111.413801,160.957192 111.717099,162.925968 C103.691233,171.893062 106.049626,173.467492 90.0055797,176.770069 C73.7711594,180.115806 83.308194,186.072388 89.5349654,187.629081 C97.0837136,189.516859 114.54788,192.190965 126.34812,175.672166 L125.877506,177.556988 C129.022226,180.075603 131.230448,193.940397 130.860342,206.508637 C130.490236,219.077469 130.243104,227.706383 132.720924,234.446337 C135.198744,241.186291 137.668286,256.351187 158.759612,251.831871 C176.383409,248.055132 185.516046,238.268009 186.786587,221.94254 C187.688203,210.336222 189.728517,212.051954 189.857404,201.675381 L191.493912,196.762901 C193.381099,181.029838 191.793663,175.95418 202.651492,178.314938 L205.290125,178.546697 C213.2817,178.9103 223.741044,177.261376 229.879723,174.408129 C243.098309,168.273589 250.93794,158.031224 237.904406,160.722476 L237.905589,160.722476" fill="currentColor" opacity="0.3"/>
    </g>
  ),
  redis: (
    <g transform="translate(-12,-12) scale(0.093)">
      {/* Layer 3 shadow */}
      <path d="M245.97 168.943c-13.662 7.121-84.434 36.22-99.501 44.075-15.067 7.856-23.437 7.78-35.34 2.09-11.902-5.69-87.216-36.112-100.783-42.597C3.566 169.271 0 166.535 0 163.951v-25.876s98.05-21.345 113.879-27.024c15.828-5.679 21.32-5.884 34.79-.95 13.472 4.936 94.018 19.468 107.331 24.344l-.006 25.51c.002 2.558-3.07 5.364-10.024 8.988"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.08" />
      {/* Layer 3 top */}
      <path d="M245.965 143.22c-13.661 7.118-84.431 36.218-99.498 44.072-15.066 7.857-23.436 7.78-35.338 2.09-11.903-5.686-87.214-36.113-100.78-42.594-13.566-6.485-13.85-10.948-.524-16.166 13.326-5.22 88.224-34.605 104.055-40.284 15.828-5.677 21.319-5.884 34.789-.948 13.471 4.934 83.819 32.935 97.13 37.81 13.316 4.881 13.827 8.9.166 16.02"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.18" />
      {/* Layer 2 shadow */}
      <path d="M245.97 127.074c-13.662 7.122-84.434 36.22-99.501 44.078-15.067 7.853-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.112-100.783-42.597C3.566 127.402 0 124.67 0 122.085V96.206s98.05-21.344 113.879-27.023c15.828-5.679 21.32-5.885 34.79-.95C162.142 73.168 242.688 87.697 256 92.574l-.006 25.513c.002 2.557-3.07 5.363-10.024 8.987"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.08" />
      {/* Layer 2 top */}
      <path d="M245.965 101.351c-13.661 7.12-84.431 36.218-99.498 44.075-15.066 7.854-23.436 7.777-35.338 2.087-11.903-5.686-87.214-36.112-100.78-42.594-13.566-6.483-13.85-10.947-.524-16.167C23.151 83.535 98.05 54.148 113.88 48.47c15.828-5.678 21.319-5.884 34.789-.949 13.471 4.934 83.819 32.933 97.13 37.81 13.316 4.88 13.827 8.9.166 16.02"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.18" />
      {/* Layer 1 shadow */}
      <path d="M245.97 83.653c-13.662 7.12-84.434 36.22-99.501 44.078-15.067 7.854-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.113-100.783-42.595C3.566 83.98 0 81.247 0 78.665v-25.88s98.05-21.343 113.879-27.021c15.828-5.68 21.32-5.884 34.79-.95C162.142 29.749 242.688 44.278 256 49.155l-.006 25.512c.002 2.555-3.07 5.361-10.024 8.986"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.08" />
      {/* Layer 1 top (topmost face) */}
      <path d="M245.965 57.93c-13.661 7.12-84.431 36.22-99.498 44.074-15.066 7.854-23.436 7.777-35.338 2.09C99.227 98.404 23.915 67.98 10.35 61.497-3.217 55.015-3.5 50.55 9.825 45.331 23.151 40.113 98.05 10.73 113.88 5.05c15.828-5.679 21.319-5.883 34.789-.948 13.471 4.935 83.819 32.934 97.13 37.811 13.316 4.876 13.827 8.897.166 16.017"
            stroke="currentColor" strokeWidth="10" fill="currentColor" fillOpacity="0.25" />
      {/* White decorative details: star, arrow, ellipse */}
      <path d="M159.283 32.757l-22.01 2.285-4.927 11.856-7.958-13.23-25.415-2.284 18.964-6.839-5.69-10.498 17.755 6.944 16.738-5.48-4.524 10.855 17.067 6.391M131.032 90.275L89.955 73.238l58.86-9.035-17.783 26.072"
            stroke="currentColor" strokeWidth="8" fill="none" opacity="0.7" />
      <ellipse cx="74.082" cy="51.541" rx="31.46" ry="12.195"
            stroke="currentColor" strokeWidth="8" fill="none" opacity="0.55" />
    </g>
  ),
  docker: (
    <g transform="translate(-12,-12) scale(0.75)">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
      <path d="M18 7H16V9H18V7Z" fill="currentColor"/>
      <path d="M10 10H12V12H10V10Z" fill="currentColor"/>
      <path d="M6.00155 16.9414C6.17244 19.8427 7.90027 24 14 24C20.8 24 23.8333 19 24.5 16.5C25.3333 16.5 27.2 16 28 14C27.5 13.5 25.5 13.5 24.5 14C24.5 13.2 24 11.5 23 11C22.3333 11.6667 21.3 13.4 22.5 15C22 16 20.6667 16 20 16H6.9429C6.41342 16 5.97041 16.4128 6.00155 16.9414Z" fill="currentColor"/>
      <path d="M9 13H7V15H9V13Z" fill="currentColor"/>
      <path d="M10 13H12V15H10V13Z" fill="currentColor"/>
      <path d="M15 13H13V15H15V13Z" fill="currentColor"/>
      <path d="M16 13H18V15H16V13Z" fill="currentColor"/>
      <path d="M21 13H19V15H21V13Z" fill="currentColor"/>
      <path d="M15 10H13V12H15V10Z" fill="currentColor"/>
      <path d="M16 10H18V12H16V10Z" fill="currentColor"/>
    </g>
  ),
  kubernetes: (
    <g transform="translate(-12,-12) scale(1.5)">
      <path d="M4.5 14.569c.214.278.539.431.874.431h5.251c.335 0 .66-.165.875-.434l3.258-4.178c.214-.278.288-.633.214-.978l-1.165-5.207a1.128 1.128 0 00-.606-.777l-4.714-2.31A1.062 1.062 0 008.002 1c-.168 0-.335.038-.485.115l-4.715 2.32a1.129 1.129 0 00-.605.777L1.032 9.42c-.084.345 0 .7.214.978L4.5 14.568z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M12.741 9.128c.098.002.196.01.293.024l.058.013.031.008a.308.308 0 01.26.371.306.306 0 01-.396.223h-.004l-.003-.001-.003-.002a1.58 1.58 0 00-.03-.006l-.05-.01a2.55 2.55 0 01-.274-.106 2.867 2.867 0 00-.533-.157.242.242 0 00-.171.064 4.656 4.656 0 00-.131-.023 3.971 3.971 0 01-1.764 2.212c.015.042.032.083.051.123a.239.239 0 00-.023.18c.074.17.165.332.271.484.06.078.114.16.164.244l.028.057.012.025a.306.306 0 01-.381.44.308.308 0 01-.172-.18l-.01-.02a1.57 1.57 0 01-.028-.058 2.546 2.546 0 01-.089-.28 2.837 2.837 0 00-.21-.512.242.242 0 00-.156-.095l-.03-.053-.035-.064a3.97 3.97 0 01-2.823-.007l-.07.125a.25.25 0 00-.132.064 2.13 2.13 0 00-.237.548 2.518 2.518 0 01-.088.28 1.196 1.196 0 01-.025.05l-.013.027v.001a.306.306 0 01-.421.173.308.308 0 01-.173-.314.306.306 0 01.041-.12l.014-.03.026-.052c.05-.085.104-.166.164-.244.108-.156.2-.322.277-.496a.302.302 0 00-.028-.173l.056-.133A3.972 3.972 0 014.22 9.532l-.134.023a.34.34 0 00-.176-.062 2.871 2.871 0 00-.533.156c-.09.04-.181.075-.274.105a1.017 1.017 0 01-.05.011l-.03.007H3.02l-.002.002h-.005a.308.308 0 01-.397-.349.306.306 0 01.261-.245l.005-.001h.002l.006-.002c.024-.006.054-.014.076-.018.097-.013.195-.021.293-.023.186-.013.37-.043.549-.09a.422.422 0 00.131-.133l.128-.037a3.938 3.938 0 01.625-2.752l-.098-.087a.338.338 0 00-.062-.176 2.854 2.854 0 00-.455-.319 2.557 2.557 0 01-.254-.148l-.048-.038-.015-.013-.004-.003a.323.323 0 01-.076-.45.295.295 0 01.244-.107.365.365 0 01.213.08l.022.017c.016.013.034.026.046.037.072.067.139.139.202.213.125.137.263.262.412.372.056.03.121.036.182.018l.11.078a3.938 3.938 0 012.552-1.224l.008-.129a.332.332 0 00.099-.158 2.844 2.844 0 00-.034-.553 2.56 2.56 0 01-.042-.29v-.082-.005A.306.306 0 018 2.82a.308.308 0 01.306.337v.087a2.529 2.529 0 01-.041.29 2.85 2.85 0 00-.035.553.242.242 0 00.1.153v.007l.007.129c.967.088 1.87.522 2.54 1.223l.116-.082a.34.34 0 00.186-.02c.149-.11.287-.236.412-.373.063-.075.13-.146.202-.213l.051-.04.017-.014a.307.307 0 11.381.477l-.024.02c-.015.012-.03.025-.043.034a2.537 2.537 0 01-.254.148 2.87 2.87 0 00-.455.32.241.241 0 00-.058.172l-.05.044-.058.053c.542.806.77 1.783.637 2.745l.123.036c.031.055.077.101.133.132.179.048.363.078.548.09z" fill="currentColor"/>
    </g>
  ),
  rabbitmq: (
    <g transform="translate(-12,-12) scale(0.093)">
      <path d="M245.733754,102.437432 L163.822615,102.437432 C161.095475,102.454639 158.475045,101.378893 156.546627,99.4504749 C154.618208,97.5220567 153.542463,94.901627 153.559669,92.174486 L153.559669,10.2633479 C153.559723,7.54730691 152.476409,4.94343327 150.549867,3.02893217 C148.623325,1.11443107 146.012711,0.0474632135 143.296723,0.0645452326 L112.636172,0.0645452326 C109.920185,0.0474632135 107.30957,1.11443107 105.383029,3.02893217 C103.456487,4.94343327 102.373172,7.54730691 102.373226,10.2633479 L102.373226,92.174486 C102.390432,94.901627 101.314687,97.5220567 99.3862689,99.4504749 C97.4578506,101.378893 94.8374209,102.454639 92.11028,102.437432 L61.4497286,102.437432 C58.7225877,102.454639 56.102158,101.378893 54.1737397,99.4504749 C52.2453215,97.5220567 51.1695761,94.901627 51.1867826,92.174486 L51.1867826,10.2633479 C51.203989,7.5362069 50.1282437,4.91577722 48.1998255,2.98735896 C46.2714072,1.05894071 43.6509775,-0.0168046317 40.9238365,0.000198540275 L10.1991418,0.000198540275 C7.48310085,0.000198540275 4.87922722,1.08366231 2.96472611,3.0102043 C1.05022501,4.93674629 -0.0167428433,7.54736062 0.000135896304,10.2633479 L0.000135896304,245.79796 C-0.0168672756,248.525101 1.05887807,251.14553 2.98729632,253.073949 C4.91571457,255.002367 7.53614426,256.078112 10.2632852,256.061109 L245.733754,256.061109 C248.460895,256.078112 251.081324,255.002367 253.009743,253.073949 C254.938161,251.14553 256.013906,248.525101 255.9967,245.79796 L255.9967,112.892808 C256.066222,110.132577 255.01362,107.462105 253.07944,105.491659 C251.14526,103.521213 248.4948,102.419191 245.733754,102.437432 Z" fill="currentColor"/>
      <path d="M204.553817,189.4159 C204.570741,193.492844 202.963126,197.408658 200.08629,200.297531 C197.209455,203.186403 193.300387,204.810319 189.223407,204.810319 L168.697515,204.810319 C164.620535,204.810319 160.711467,203.186403 157.834632,200.297531 C154.957796,197.408658 153.350181,193.492844 153.367105,189.4159 L153.367105,168.954151 C153.350181,164.877207 154.957796,160.961393 157.834632,158.07252 C160.711467,155.183648 164.620535,153.559732 168.697515,153.559732 L189.223407,153.559732 C193.300387,153.559732 197.209455,155.183648 200.08629,158.07252 C202.963126,160.961393 204.570741,164.877207 204.553817,168.954151 L204.553817,189.4159 L204.553817,189.4159 Z" fill="none" stroke="background" strokeWidth="15"/>
    </g>
  ),
  api: (
    <g transform="translate(-12,-12) scale(0.023)">
      <path d="M865 386.5c11 0 20-9 20-20s-9-20-20-20h-69.7v-56.8c0-38.6-31.4-70-70-70h-27.8v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H611v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-46.5v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3H438v-67.3c0-11-9-20-20-20s-20 9-20 20v67.3h-85.8c-38.6 0-70 31.4-70 70v56.8h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V433h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v46.5h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7V606h-69.7c-11 0-20 9-20 20s9 20 20 20h69.7v56.8c0 38.6 31.4 70 70 70H343v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5H516v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h46.5v72.5c0 11 9 20 20 20s20-9 20-20v-72.5h82.8c38.6 0 70-31.4 70-70V646H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865c11 0 20-9 20-20s-9-20-20-20h-69.7V473H865c11 0 20-9 20-20s-9-20-20-20h-69.7v-46.5H865z" fill="none" stroke="currentColor" strokeWidth="40"/>
      <rect x="282" y="289" width="443" height="443" rx="30" fill="currentColor" opacity="0.2"/>
    </g>
  ),
  aws: (
    <g transform="translate(-12,-12) scale(0.75)">
      <path d="M12.778,6.782A7.112,7.112,0,0,1,19.3,11a3.638,3.638,0,0,1,2.068-.636,3.583,3.583,0,0,1,3.619,3.5A5.69,5.69,0,0,1,30,18.993v.477c0,2.347-2.545,4.693-5.688,4.693H7.648C4.506,24.163,2,21.816,2,19.47v-.477A5.527,5.527,0,0,1,5.619,14.14v-.2A7.129,7.129,0,0,1,12.778,6.782Z" fill="currentColor" opacity="0.3"/>
      <path d="M30,19.152v1.273c0,2.307-2.545,4.693-5.648,4.693H7.648C4.506,25.118,2,22.771,2,20.424V19.152Z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    </g>
  ),
};

// ─── Architecture Layout ────────────────────────────────────────────────────
const NODES: ArchNode[] = [
  { id: 'client',    label: 'Client',       x: 140,  y: 110, icon: 'web' },
  { id: 'gateway',   label: 'API Gateway',  x: 420,  y: 110, icon: 'gateway' },
  { id: 'api',       label: 'REST API',     x: 700,  y: 110, icon: 'api' },
  { id: 'lambda',    label: 'Lambda',       x: 650,  y: 520, icon: 'lambda' },
  { id: 'server1',   label: 'Backend A',    x: 950,  y: 110, icon: 'server', canFail: true },
  { id: 'server2',   label: 'Backend B',    x: 920,  y: 520, icon: 'server' },
  { id: 'rabbitmq',  label: 'RabbitMQ',     x: 1190, y: 190, icon: 'rabbitmq' },
  { id: 'postgres',  label: 'PostgreSQL',   x: 1190, y: 400, icon: 'database' },
  { id: 'redis',     label: 'Redis',        x: 950,  y: 300, icon: 'redis', canFail: true },
  { id: 'docker',    label: 'Docker',       x: 400,  y: 520, icon: 'docker' },
  { id: 'k8s',       label: 'Kubernetes',   x: 100,  y: 350, icon: 'kubernetes' },
  { id: 'aws',       label: 'AWS Cloud',    x: 200,  y: 520, icon: 'aws' },
];

// ─── Connection paths (Bézier curves between nodes) ─────────────────────────
function buildPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

const nodeMap = new Map(NODES.map(n => [n.id, n]));
function conn(fromId: string, toId: string): Connection {
  const a = nodeMap.get(fromId)!;
  const b = nodeMap.get(toId)!;
  return { from: fromId, to: toId, path: buildPath(a.x, a.y, b.x, b.y) };
}

const CONNECTIONS: Connection[] = [
  conn('client', 'gateway'),
  conn('gateway', 'api'),
  conn('gateway', 'lambda'),
  conn('api', 'server1'),
  conn('lambda', 'server2'),
  conn('server1', 'rabbitmq'),
  conn('server2', 'rabbitmq'),
  conn('server1', 'postgres'),
  conn('server2', 'redis'),
  conn('rabbitmq', 'postgres'),
  conn('aws', 'k8s'),
  conn('k8s', 'docker'),
  conn('docker', 'server2'),
];

// ─── Colors ─────────────────────────────────────────────────────────────────
const COLORS = {
  bg: '#0a0a0a',
  nodeFill: '#0f1014',
  nodeStroke: '#2d1f4e',
  stroke: '#7b41b3',
  strokeGlow: '#ddb7ff',
  hover: '#ddb7ff',
  fail: '#f87171',
  text: '#94a3b8',
  labelText: '#cec3d3',
};

// ─── Individual Node Component ──────────────────────────────────────────────
const NODE_W = 120;
const NODE_H = 70;

interface NodeComponentProps {
  node: ArchNode;
  isFailing: boolean;
  svgMouseX: ReturnType<typeof useMotionValue<number>>;
  svgMouseY: ReturnType<typeof useMotionValue<number>>;
}

const NodeComponent = memo(({ node, isFailing, svgMouseX, svgMouseY }: NodeComponentProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // ── Parallax repulsion: node drifts away from the cursor ─────────────────
  const INFLUENCE_RADIUS = 280; // SVG units
  const MAX_OFFSET = 8;         // SVG units cap

  const parallaxX = useTransform(svgMouseX, (mx) => {
    if (shouldReduceMotion) return 0;
    const dist = mx - node.x;
    const absDist = Math.abs(dist);
    if (absDist > INFLUENCE_RADIUS) return 0;
    const strength = (1 - absDist / INFLUENCE_RADIUS) ** 2; // quadratic falloff
    const raw = -dist * strength * 0.15;
    return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, raw));
  });

  const parallaxY = useTransform(svgMouseY, (my) => {
    if (shouldReduceMotion) return 0;
    const dist = my - node.y;
    const absDist = Math.abs(dist);
    if (absDist > INFLUENCE_RADIUS) return 0;
    const strength = (1 - absDist / INFLUENCE_RADIUS) ** 2;
    const raw = -dist * strength * 0.15;
    return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, raw));
  });

  const springX = useSpring(parallaxX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(parallaxY, { stiffness: 60, damping: 20, mass: 0.5 });
  // ─────────────────────────────────────────────────────────────────────────

  const currentStroke = isFailing ? COLORS.fail : isHovered ? COLORS.hover : COLORS.nodeStroke;
  const currentGlow = isFailing
    ? `drop-shadow(0 0 12px ${COLORS.fail})`
    : isHovered
    ? `drop-shadow(0 0 16px ${COLORS.hover})`
    : `drop-shadow(0 0 4px rgba(59, 130, 246, 0.2))`;

  const floatDuration = 3 + Math.random() * 2;
  const floatDelay = Math.random() * 2;

  return (
    <motion.g style={{ x: springX, y: springY }}>
      {/* Inner floating animation */}
      <motion.g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
        animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatDelay,
        }}
      >
        {/* Node background */}
        <motion.rect
          x={node.x - NODE_W / 2}
          y={node.y - NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx={8}
          fill={COLORS.nodeFill}
          stroke={currentStroke}
          strokeWidth={1.5}
          animate={{
            filter: currentGlow,
            scale: isHovered ? 1.05 : isFailing ? [1, 0.98, 1] : 1,
          }}
          transition={{
            filter: { duration: 0.3 },
            scale: isFailing
              ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 },
          }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        />

        {/* Icon */}
        <g
          transform={`translate(${node.x}, ${node.y - 8})`}
          style={{ color: isFailing ? COLORS.fail : isHovered ? COLORS.hover : COLORS.stroke }}
        >
          {ICONS[node.icon]}
        </g>

        {/* Label */}
        <text
          x={node.x}
          y={node.y + NODE_H / 2 - 8}
          textAnchor="middle"
          fill={isFailing ? COLORS.fail : COLORS.labelText}
          fontSize={10}
          fontFamily="'Space Grotesk', monospace"
          fontWeight={500}
          letterSpacing="0.05em"
        >
          {node.label}
        </text>

        {/* Failure indicator */}
        {isFailing && (
          <motion.circle
            cx={node.x + NODE_W / 2 - 8}
            cy={node.y - NODE_H / 2 + 8}
            r={4}
            fill={COLORS.fail}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.g>
    </motion.g>
  );
});

NodeComponent.displayName = 'NodeComponent';

// ─── Individual Connection Component ────────────────────────────────────────
interface ConnectionComponentProps {
  connection: Connection;
  isFailing: boolean;
  isHovered: boolean;
}

const ConnectionComponent = memo(({ connection, isFailing, isHovered }: ConnectionComponentProps) => {
  const shouldReduceMotion = useReducedMotion();
  const strokeColor = isFailing ? COLORS.fail : isHovered ? COLORS.hover : COLORS.stroke;
  const strokeOpacity = isFailing ? 0.4 : isHovered ? 0.9 : 0.35;

  return (
    <g>
      {/* Background path (thicker for hover area) */}
      <path
        d={connection.path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />

      {/* Visible path */}
      <motion.path
        d={connection.path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHovered ? 2 : 1.2}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        animate={
          shouldReduceMotion || isFailing
            ? {}
            : {
                strokeDashoffset: [0, -40],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          strokeDasharray: '8 12',
          filter: isHovered
            ? `drop-shadow(0 0 6px ${COLORS.hover})`
            : isFailing
            ? `drop-shadow(0 0 4px ${COLORS.fail})`
            : 'none',
        }}
      />

      {/* Flowing dot along path */}
      {!isFailing && !shouldReduceMotion && (
        <motion.circle
          cx={0}
          cy={0}
          r={2.5}
          fill={isHovered ? COLORS.hover : COLORS.strokeGlow}
          opacity={0.8}
          filter={`drop-shadow(0 0 4px ${isHovered ? COLORS.hover : COLORS.stroke})`}
        >
          <animateMotion
            dur={`${2 + Math.random()}s`}
            repeatCount="indefinite"
            path={connection.path}
          />
        </motion.circle>
      )}
    </g>
  );
});

ConnectionComponent.displayName = 'ConnectionComponent';

// ─── Main Background Component ──────────────────────────────────────────────
const ArchitectureBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  // Track which nodes are currently "failing"
  const [failingNodes, setFailingNodes] = useState<Set<string>>(new Set());

  // Track hovered connections
  // const [hoveredConn, setHoveredConn] = useState<string | null>(null);

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const svgMouseX = useMotionValue(-9999);
  const svgMouseY = useMotionValue(-9999);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Mouse tracking via window (background has z-index -10, so it never receives DOM mouse events)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Spotlight in container-space
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        spotlightX.set(e.clientX - rect.left);
        spotlightY.set(e.clientY - rect.top);
      }
      // Mouse in SVG-space (for node parallax)
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        svgMouseX.set(((e.clientX - svgRect.left) / svgRect.width) * 1400);
        svgMouseY.set(((e.clientY - svgRect.top) / svgRect.height) * 600);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, spotlightX, spotlightY, svgMouseX, svgMouseY]);

  // Failure simulation — randomly toggle failure state
  useEffect(() => {
    if (shouldReduceMotion) return;

    const failableNodes = NODES.filter(n => n.canFail).map(n => n.id);
    if (failableNodes.length === 0) return;

    const interval = setInterval(() => {
      const targetNode = failableNodes[Math.floor(Math.random() * failableNodes.length)];

      setFailingNodes(prev => {
        const next = new Set(prev);
        if (next.has(targetNode)) {
          next.delete(targetNode);
        } else {
          next.add(targetNode);
        }
        return next;
      });

      // Auto-recover after 3-5 seconds
      setTimeout(() => {
        setFailingNodes(prev => {
          const next = new Set(prev);
          next.delete(targetNode);
          return next;
        });
      }, 3000 + Math.random() * 2000);
    }, 6000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Check if a connection involves a failing node
  const isConnectionFailing = useCallback(
    (conn: Connection) => failingNodes.has(conn.from) || failingNodes.has(conn.to),
    [failingNodes]
  );

  const spotlightStyle = useMotionTemplate`
    radial-gradient(250px circle at ${spotlightX}px ${spotlightY}px, 
      rgba(123, 65, 179, 0.10) 0%, 
      transparent 80%
    )
  `;

  return (
    <div
      ref={containerRef}
      id="arch-background"
      className="absolute inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Base dimming layer - pointer-events-none so mouse reaches SVG */}
      <div className="absolute inset-0 bg-background/40 z-10 pointer-events-none" />

      {/* Mouse Spotlight Layer */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
          style={{ background: spotlightStyle }}
        />
      )}

      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(75,0,130,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(123,65,179,0.06) 0%, transparent 50%)',
        }}
      />

      <motion.svg
        ref={svgRef}
        viewBox="0 0 1400 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
        style={{ willChange: 'auto', zIndex: 1 }}
      >
        {/* SVG Filters */}
        <defs>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feFlood floodColor={COLORS.fail} floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(75,0,130,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections layer */}
        <g>
          {CONNECTIONS.map((c) => (
            <ConnectionComponent
              key={`${c.from}-${c.to}`}
              connection={c}
              isFailing={isConnectionFailing(c)}
              isHovered={false /* hoveredConn === `${c.from}-${c.to}` */}
            />
          ))}
        </g>

        {/* Nodes layer */}
        <g>
          {NODES.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              isFailing={failingNodes.has(node.id)}
              svgMouseX={svgMouseX}
              svgMouseY={svgMouseY}
            />
          ))}
        </g>

        {/* Decorative floating particles */}
        {!shouldReduceMotion &&
          Array.from({ length: 15 }).map((_, i) => {
            const cx = 100 + Math.random() * 1200;
            const cy = 50 + Math.random() * 500;
            return (
              <motion.circle
                key={`particle-${i}`}
                r={1 + Math.random() * 1.5}
                fill={COLORS.strokeGlow}
                initial={{ cx, cy, opacity: 0.15 }}
                animate={{
                  cy: [cy, cy - 20 - Math.random() * 30, cy],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 3,
                }}
              />
            );
          })}
      </motion.svg>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
};

export default memo(ArchitectureBackground);
