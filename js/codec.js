// Nén công thức vào link và giải nén ngược lại. Không cần máy chủ:
// toàn bộ dữ liệu nằm sau dấu # nên cũng không bao giờ được gửi lên server.
(function () {
  function toB64url(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function fromB64url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  async function pipe(bytes, stream) {
    const buf = await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer();
    return new Uint8Array(buf);
  }

  async function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    try {
      if (typeof CompressionStream !== 'undefined') {
        return 'z' + toB64url(await pipe(bytes, new CompressionStream('deflate-raw')));
      }
    } catch (e) { /* trình duyệt cũ: dùng dạng không nén */ }
    return 'j' + toB64url(bytes);
  }

  // Giới hạn dung lượng sau giải nén: link bị sửa khéo không thể làm treo trình duyệt.
  const MAX_LINK = 200000;
  const MAX_JSON = 512 * 1024;

  function unsupported() {
    const e = new Error('Trình duyệt không hỗ trợ giải nén');
    e.code = 'unsupported';
    return e;
  }

  async function inflate(bytes) {
    let stream;
    try {
      stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    } catch (e) { throw unsupported(); }
    const reader = stream.getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_JSON) { reader.cancel(); throw new Error('Dữ liệu quá lớn'); }
      chunks.push(value);
    }
    const out = new Uint8Array(total);
    let off = 0;
    chunks.forEach((c) => { out.set(c, off); off += c.length; });
    return out;
  }

  async function decode(str) {
    if (!str || str.length > MAX_LINK) throw new Error('Link không hợp lệ');
    const kind = str[0];
    let bytes = fromB64url(str.slice(1));
    if (kind === 'z') {
      if (typeof DecompressionStream === 'undefined') throw unsupported();
      bytes = await inflate(bytes);
    } else if (kind !== 'j' || bytes.length > MAX_JSON) {
      throw new Error('Định dạng link không đúng');
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  window.Codec = { encode, decode };
})();
