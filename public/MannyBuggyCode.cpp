#include "bits/stdc++.h"

#ifndef ONLINE_JUDGE
#else
#define debug(...)
#define debugArr(...)
#endif

using namespace std;

const int MOD = 1e9 + 7;
//const int MOD = 998244353;

typedef long long ll;
typedef long double ld;
typedef vector<long long> vi;
typedef vector<vector<long long>> vvi;
typedef pair<int, int> pii;
typedef pair<long long, long long> pll;

template <class T> bool ckmax(T &a, const T &b) { if (a<b) { a=b; return true; } return false; }
template <class T> bool ckmin(T &a, const T &b) { if (b<a) { a=b; return true; } return false; }
template <typename T> istream &operator >>(istream &is, vector<T> &a) {
    copy_n(istream_iterator<T>(is), a.size(), a.begin()); return is;
}

#define ALL(a) (a).begin(), (a).end()
#define ff first
#define ss second
#define endl '\n'

void solve() {
    ll n, k, q;
    cin >> n >> k >> q;
    
    vi a(k+1), b(k+1);
    for (int i = 1; i <= k; ++i) {
        cin >> a[i];
    }
    for (int i = 1; i <= k; ++i) {
        cin >> b[i];
    }
    
    vector<ld> speed(k);
    for (int i = 0; i < k; ++i) {
        speed[i] = ((ld) (a[i+1] - a[i])) / (b[i+1] - b[i]);
    }
    
    while (q--) {
        ll cur;
        cin >> cur;
        
        int idx = prev(upper_bound(a.begin(), a.end(), cur)) - a.begin();

        if (a[idx] == cur) {
            cout << b[idx] << " ";                        
            continue;
        }
        
        ll d = cur - a[idx];
        ld time = b[idx];
        
        time += ((ld) d / speed[idx]);

        cout << ll(floorl(time)) << " ";
        cout << time << endl;
    }
    cout << endl;
}

int main() {
    std::ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    cin >> t; //comment if one test case

    while (t--) {
        solve();
    }

    return 0;
}