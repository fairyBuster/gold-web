/* ============================================================================
   test_relativize.cjs — verifies the review-image URL fix in apiClient.js
   against (a) synthetic edge cases and (b) the exact payload from the bug
   report, salted the same way the backend does.

   The functions under test are extracted from the real source file, so this
   checks the shipped code, not a copy.

   Run (node is not installed on the host — use docker):
     docker run --rm -v /home/ubuntu/gold-web:/app -w /app node:20-alpine \
       node tmp-html/reviewsprobe/test_relativize.cjs
   ============================================================================ */
const fs = require('fs');

const src = fs.readFileSync('/app/src/lib/apiClient.js', 'utf8');

const pick = (re, label) => {
  const m = src.match(re);
  if (!m) {
    console.error(`extract failed: ${label}`);
    process.exit(1);
  }
  return m[0];
};

const saltConst = pick(/const RESPONSE_SALT = [^\n]+;/).replace(
  'import.meta.env.VITE_RESPONSE_SALT',
  'undefined'
);
const decodeFn = pick(/export function decodeSaltedResponse\(body\) \{[\s\S]*?\n\}/).replace(
  /^export /,
  ''
);
const relativizeFn = pick(/const ABSOLUTE_MEDIA_URL = [^\n]+\n[\s\S]*?\n\}/);

const mod = { exports: {} };
new Function(
  'module',
  'exports',
  `${saltConst}\n${decodeFn}\n${relativizeFn}\nmodule.exports = { decodeSaltedResponse, relativizeMediaUrls };`
)(mod, mod.exports);
const { decodeSaltedResponse, relativizeMediaUrls } = mod.exports;

let failures = 0;
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
}

/* ---- synthetic edge cases ---- */
check(
  'absolute http /media URL -> same-origin path',
  relativizeMediaUrls('http://richnetworkers.online/media/reviews/17/a.jpg'),
  '/media/reviews/17/a.jpg'
);
check(
  'absolute https /media URL with query -> keeps query',
  relativizeMediaUrls('https://richnetworkers.online/media/news/x.png?v=2'),
  '/media/news/x.png?v=2'
);
check('works for any host (domain may change)', relativizeMediaUrls(['http://other.example/media/y.jpg']), [
  '/media/y.jpg',
]);
check('already-relative path untouched', relativizeMediaUrls('/media/rel.png'), '/media/rel.png');
check(
  'absolute non-/media URL untouched',
  relativizeMediaUrls('http://other.example/notmedia/y.jpg'),
  'http://other.example/notmedia/y.jpg'
);
check(
  'deep walk keeps structure and scalars',
  relativizeMediaUrls({ a: { b: [null, 5, true, 'http://h/media/z.png'] } }),
  { a: { b: [null, 5, true, '/media/z.png'] } }
);

/* ---- round trip: exact payload from the bug report, salted like the backend ---- */
const SALT = 'KXXADFDFDF';
const salt = (obj) => ({
  data: (Buffer.from(JSON.stringify(obj), 'utf8').toString('base64') + SALT)
    .split('')
    .reverse()
    .join(''),
});

const sample = [
  {
    id: 17,
    user_display_name: 'Andrew Fernandez',
    text: 'Yshshshs',
    rating: 4,
    images: [
      {
        id: 17,
        image: 'http://richnetworkers.online/media/reviews/17/ef91aea805454517a416a991642c70dc.jpg',
        created_at: '2026-09-16 01:55:16',
      },
    ],
    likes_count: 0,
    is_liked: false,
    created_at: '2026-09-16 01:55:16',
    updated_at: '2026-09-16 01:56:09',
  },
];
const decoded = decodeSaltedResponse(salt(sample));
check(
  'salted round trip: image is same-origin',
  decoded[0].images[0].image,
  '/media/reviews/17/ef91aea805454517a416a991642c70dc.jpg'
);
check('salted round trip: no backend host left anywhere', JSON.stringify(decoded).includes('richnetworkers'), false);

/* ---- best effort: live endpoint ---- */
(async () => {
  try {
    const res = await fetch('https://richnetworkers.online/api/reviews/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      },
    });
    const payload = decodeSaltedResponse(await res.json());
    const img = payload?.[0]?.images?.[0]?.image;
    console.log(`INFO  live payload first image: ${JSON.stringify(img)}`);
    if (typeof img === 'string') {
      check('live payload: first image is same-origin /media path', img.startsWith('/media/'), true);
    } else {
      console.log('INFO  live payload has no review image; skipping that assertion');
    }
  } catch (err) {
    console.log(`INFO  live fetch skipped (${err.message})`);
  }
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})();
