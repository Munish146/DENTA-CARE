# =============================================================================
# DentaCare Fix-All Script
# Fixes: mobile nav buttons, footer social icons, CTA contrast, quick links
# =============================================================================

$pagesDir = "c:\Users\ELCOT\Desktop\DENTA CARE\pages"

# ---- Helper: Replace in file ----
function Replace-InFile($file, $old, $new) {
    $content = Get-Content $file -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($old)) {
        $content = $content.Replace($old, $new)
        Set-Content $file $content -Encoding UTF8 -NoNewline
        Write-Host "  FIXED in $([System.IO.Path]::GetFileName($file))"
        return $true
    }
    return $false
}

# =============================================================================
# 1. FIX CONTACT.HTML MOBILE BUTTONS
# =============================================================================
Write-Host "`n[1] Fixing contact.html mobile buttons..."
$contact = "$pagesDir\contact.html"
$content = Get-Content $contact -Raw -Encoding UTF8

# Fix mobile theme button
$old = '<button onclick="toggleTheme()"
                class="flex-1 py-3 rounded-xl
                       border border-slate-200
                       dark:border-slate-600 cursor-pointer">
          <i class="fa-solid fa-moon mr-2"></i>
          Theme
        </button>'
$new = '<button id="mobileThemeToggle" onclick="toggleTheme()" type="button"
                class="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer text-slate-800 dark:text-white flex items-center justify-center gap-2">
          <i class="fa-solid fa-moon theme-icon"></i> <span>Theme</span>
        </button>'

if ($content.Contains($old)) {
    $content = $content.Replace($old, $new)
    Write-Host "  Fixed mobileThemeToggle in contact.html"
}

# Fix mobile RTL button
$old2 = '<button onclick="toggleDirection()"
                class="px-5 py-3 rounded-xl
                       border border-slate-200
                       dark:border-slate-600 cursor-pointer">
          RTL
        </button>'
$new2 = '<button id="mobileRtlToggle" onclick="toggleDirection()" type="button"
                class="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-[#111A3A] dark:text-white font-bold cursor-pointer"
                title="Toggle LTR / RTL Direction">
          <span class="rtl-text">RTL</span>
        </button>'

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "  Fixed mobileRtlToggle in contact.html"
}

# Also fix the moon icon to have theme-icon class  
$content = $content.Replace('<i class="fa-solid fa-moon mr-2"></i>', '<i class="fa-solid fa-moon theme-icon mr-2"></i>')

Set-Content $contact $content -Encoding UTF8 -NoNewline

# =============================================================================
# 2. FIX ALL PAGES: CTA gradient-text -> text-pink & text-white/80 -> text-white/90
# =============================================================================
Write-Host "`n[2] Fixing CTA contrast in all pages..."
$pages = Get-ChildItem "$pagesDir\*.html" -Exclude "login.html","register.html"
foreach ($p in $pages) {
    $c = Get-Content $p.FullName -Raw -Encoding UTF8
    $changed = $false
    
    # In CTA sections: gradient-text spans -> text-pink (on dark gradient backgrounds)
    # Only inside CTA divs that already have text-white
    if ($c -match 'bg-gradient-to-r from-navy.*?gradient-text') {
        # Replace gradient-text spans inside CTA sections  
        $newC = [regex]::Replace($c, '(<div class="[^"]*rounded-3xl bg-gradient[^"]*">[^<]*(?:<[^<]*>)*[^<]*)<span class="gradient-text">', '$1<span class="text-pink">')
        if ($newC -ne $c) { $c = $newC; $changed = $true }
    }
    
    # Improve white text opacity in CTA
    $c2 = $c.Replace('class="text-white/80 max-w-2xl mx-auto mt-5', 'class="text-white/90 max-w-2xl mx-auto mt-5')
    $c2 = $c2.Replace('class="text-white/80 max-w-2xl mx-auto mt-4', 'class="text-white/90 max-w-2xl mx-auto mt-4')
    if ($c2 -ne $c) { $c = $c2; $changed = $true }
    
    if ($changed) {
        Set-Content $p.FullName $c -Encoding UTF8 -NoNewline
        Write-Host "  Updated CTA in $($p.Name)"
    }
}

# =============================================================================
# 3. FIX ALL PAGES: Footer Quick Links (Home 1 / Home 2 -> Home)
# =============================================================================
Write-Host "`n[3] Fixing footer Quick Links..."
foreach ($p in $pages) {
    $c = Get-Content $p.FullName -Raw -Encoding UTF8
    $changed = $false
    
    $old = '<a href="index.html" class="block hover:text-pink transition">Home 1</a>
          <a href="home2.html" class="block hover:text-pink transition">Home 2</a>'
    $new = '<a href="index.html" class="block hover:text-pink transition">Home</a>'
    
    if ($c.Contains($old)) {
        $c = $c.Replace($old, $new)
        $changed = $true
        Write-Host "  Fixed Quick Links in $($p.Name)"
    }
    
    if ($changed) {
        Set-Content $p.FullName $c -Encoding UTF8 -NoNewline
    }
}

# =============================================================================
# 4. FIX ALL PAGES: Add missing Twitter/Instagram/YouTube to footer social section
# =============================================================================
Write-Host "`n[4] Adding social icons to footer..."

$githubLinkedinOnly = '        <div class="flex items-center gap-3 mt-6">
          <a href="https://github.com/Munish146"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Munish on GitHub"
             aria-label="GitHub Profile">
            <i class="fa-brands fa-github text-lg"></i>
          </a>

          <a href="https://www.linkedin.com/in/munishu2004"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Munish on LinkedIn"
             aria-label="LinkedIn Profile">
            <i class="fa-brands fa-linkedin-in text-lg"></i>
          </a>
        </div>'

$allSocials = '        <div class="flex items-center flex-wrap gap-3 mt-6">
          <a href="https://github.com/Munish146"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Munish on GitHub"
             aria-label="GitHub Profile">
            <i class="fa-brands fa-github text-lg"></i>
          </a>

          <a href="https://www.linkedin.com/in/munishu2004"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Munish on LinkedIn"
             aria-label="LinkedIn Profile">
            <i class="fa-brands fa-linkedin-in text-lg"></i>
          </a>

          <a href="https://twitter.com"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Twitter / X"
             aria-label="Twitter Profile">
            <i class="fa-brands fa-x-twitter text-lg"></i>
          </a>

          <a href="https://instagram.com"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="Instagram"
             aria-label="Instagram Profile">
            <i class="fa-brands fa-instagram text-lg"></i>
          </a>

          <a href="https://youtube.com"
             target="_blank"
             rel="noopener noreferrer"
             class="footer-social-btn"
             title="YouTube"
             aria-label="YouTube Channel">
            <i class="fa-brands fa-youtube text-lg"></i>
          </a>
        </div>'

foreach ($p in $pages) {
    $c = Get-Content $p.FullName -Raw -Encoding UTF8
    if ($c.Contains($githubLinkedinOnly) -and -not $c.Contains('fa-youtube')) {
        $c = $c.Replace($githubLinkedinOnly, $allSocials)
        Set-Content $p.FullName $c -Encoding UTF8 -NoNewline
        Write-Host "  Added social icons to $($p.Name)"
    }
    elseif ($c.Contains('<!-- GITHUB & LINKEDIN PROFILES')) {
        # Fix older comment style
        $c = $c.Replace('<!-- GITHUB & LINKEDIN PROFILES (LEFT COLUMN) -->', '<!-- SOCIAL PROFILES (LEFT COLUMN) -->')
        Set-Content $p.FullName $c -Encoding UTF8 -NoNewline
    }
}

# =============================================================================
# 5. FIX APPOINTMENT.HTML CTA - bg-[#111A3A] -> gradient
# =============================================================================
Write-Host "`n[5] Fixing appointment.html CTA..."
$appt = "$pagesDir\appointment.html"
$c = Get-Content $appt -Raw -Encoding UTF8
if ($c.Contains('bg-gradient-to-r from-navy via-purple to-pink')) {
    Write-Host "  appointment.html CTA already has gradient"
} else {
    $c = $c.Replace(
        'bg-gradient-to-r from-navy via-purple to-pink text-white',
        'bg-gradient-to-r from-navy via-purple to-pink dark:from-[#0a0f24] dark:via-[#131b42] dark:to-[#1c123d] dark:border dark:border-purple-500/30 text-white'
    )
    Set-Content $appt $c -Encoding UTF8 -NoNewline
}

# =============================================================================
# 6. FIX INDEX.HTML: Make sure book appointment link is present in mobile menu
# =============================================================================
Write-Host "`n[6] Checking index.html mobile menu..."
$idx = "$pagesDir\index.html"
$c = Get-Content $idx -Raw -Encoding UTF8
if ($c.Contains('id="mobileThemeToggle"')) {
    Write-Host "  index.html mobileThemeToggle OK"
} else {
    Write-Host "  WARN: index.html mobileThemeToggle missing"
}

Write-Host "`n=== DONE ==="
